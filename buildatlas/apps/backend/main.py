import os
import json
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

# STEP 1 — SETUP AND IMPORTS
load_dotenv()
if os.getenv("GEMINI_API_KEY"):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

app = FastAPI()

# STEP 2 — LOAD ALL MODELS ON STARTUP
try:
    model_dir = os.path.join(os.path.dirname(__file__), "../../packages/ml/models")
    cost_model = joblib.load(os.path.join(model_dir, "cost_model.pkl"))
    duration_model = joblib.load(os.path.join(model_dir, "duration_model.pkl"))
    enc_project_type = joblib.load(os.path.join(model_dir, "encoder_project_type.pkl"))
    enc_location_tier = joblib.load(os.path.join(model_dir, "encoder_location_tier.pkl"))
    enc_structure_type = joblib.load(os.path.join(model_dir, "encoder_structure_type.pkl"))
    enc_material_quality = joblib.load(os.path.join(model_dir, "encoder_material_quality.pkl"))
    enc_site_condition = joblib.load(os.path.join(model_dir, "encoder_site_condition.pkl"))
except FileNotFoundError:
    cost_model = joblib.load("cost_model.pkl")
    duration_model = joblib.load("duration_model.pkl")
    enc_project_type = joblib.load("encoder_project_type.pkl")
    enc_location_tier = joblib.load("encoder_location_tier.pkl")
    enc_structure_type = joblib.load("encoder_structure_type.pkl")
    enc_material_quality = joblib.load("encoder_material_quality.pkl")
    enc_site_condition = joblib.load("encoder_site_condition.pkl")

# STEP 3 — DEFINE INPUT SCHEMAS
class ProjectInput(BaseModel):
    project_type: str
    location_tier: str
    total_area_sqft: float
    num_floors: int
    structure_type: str
    material_quality: str
    num_workers: int
    site_condition: str

class ChatInput(BaseModel):
    message: str
    project_context: str

# STEP 6 — ADD CORS MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# STEP 7 — ADD HEALTH CHECK
@app.get("/")
def health_check():
    return {"status": "BuildAtlas API is live"}

# STEP 4 — BUILD POST /estimate ENDPOINT
@app.post("/estimate")
def estimate(project: ProjectInput):
    # 4a. Encode the categorical inputs using the loaded encoders.
    try:
        encoded_project_type = enc_project_type.transform([project.project_type])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid value for project_type")
        
    try:
        encoded_location_tier = enc_location_tier.transform([project.location_tier])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid value for location_tier")
        
    try:
        encoded_structure_type = enc_structure_type.transform([project.structure_type])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid value for structure_type")
        
    try:
        encoded_material_quality = enc_material_quality.transform([project.material_quality])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid value for material_quality")
        
    try:
        encoded_site_condition = enc_site_condition.transform([project.site_condition])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid value for site_condition")

    # 4b. Build a numpy array in this exact column order
    input_data = np.array([[
        encoded_project_type, 
        encoded_location_tier, 
        project.total_area_sqft, 
        project.num_floors, 
        encoded_structure_type, 
        encoded_material_quality, 
        project.num_workers, 
        encoded_site_condition
    ]])

    # 4c. Predict cost using cost_model.predict()
    predicted_cost = cost_model.predict(input_data)[0]
    tree_preds_cost = np.array([t.predict(input_data) for t in cost_model.estimators_])
    std_cost = np.std(tree_preds_cost)
    cost_low = round((predicted_cost - std_cost) / 1000) * 1000
    cost_high = round((predicted_cost + std_cost) / 1000) * 1000

    # 4d. Predict duration using duration_model.predict()
    predicted_duration = duration_model.predict(input_data)[0]
    tree_preds_duration = np.array([t.predict(input_data) for t in duration_model.estimators_])
    std_duration = np.std(tree_preds_duration)
    duration_low = max(1, int(predicted_duration - std_duration))
    duration_high = int(predicted_duration + std_duration)

    # 4e. Build a prompt string and call Gemini to generate a construction plan
    prompt = f"""You are a senior construction planning expert in India.
     A project has been submitted with the following details:
     - Type: {project.project_type}
     - Location Tier: {project.location_tier}
     - Area: {project.total_area_sqft} sqft
     - Floors: {project.num_floors}
     - Structure: {project.structure_type}
     - Material Quality: {project.material_quality}
     - Workers: {project.num_workers}
     - Site Condition: {project.site_condition}
     - Estimated Cost: ₹{cost_low} to ₹{cost_high}
     - Estimated Duration: {duration_low} to {duration_high} days

     Generate a JSON response with exactly these keys:
     {{
       "schedule": [ {{ "week": 1, "task": "string", "milestone": true }} ],
       "resources": {{ "workers_breakdown": {{}}, "materials": [], "equipment": [] }},
       "risk_flags": [],
       "recommendation": "string"
     }}
     Return only valid JSON. No explanation. No markdown."""

    try:
        res = model.generate_content(prompt)
        raw_text = res.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()
    except Exception as repr_err:
        raw_text = str(repr_err)

    # 4f. Parse the Gemini response text as JSON
    try:
        gemini_data = json.loads(raw_text)
    except Exception:
        gemini_data = {"gemini_raw": raw_text}

    # 4g. Return a final JSON response
    final_response = {
        "cost_low": cost_low,
        "cost_high": cost_high,
        "cost_predicted": predicted_cost,
        "duration_low": duration_low,
        "duration_high": duration_high,
        "duration_predicted": predicted_duration
    }
    
    if "gemini_raw" in gemini_data:
        final_response["gemini_raw"] = gemini_data["gemini_raw"]
    else:
        final_response["schedule"] = gemini_data.get("schedule", [])
        final_response["resources"] = gemini_data.get("resources", {})
        final_response["risk_flags"] = gemini_data.get("risk_flags", [])
        final_response["recommendation"] = gemini_data.get("recommendation", "")

    return final_response

# STEP 5 — BUILD POST /chat ENDPOINT
@app.post("/chat")
def chat_endpoint(chat_in: ChatInput):
    prompt = f"""You are a construction planning AI assistant for Indian projects.
 Project context: {chat_in.project_context}
 User question: {chat_in.message}
 Answer clearly and helpfully. Keep response under 200 words.
 If the user asks about cost or time, refer to the project context."""

    try:
        res = model.generate_content(prompt)
        text = res.text.strip()
    except Exception as e:
        text = str(e)

    return {"reply": text}

# STEP 8 — RUN SERVER
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
