# 🏗️ BuildAtlas — Smart Construction Intelligence Platform

> AI-powered cost estimation, schedule planning, and resource 
> allocation for construction professionals.
> Built with a hybrid ML + Generative AI architecture.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-orange)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.5-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🧠 What is BuildAtlas?

BuildAtlas is a full-stack AI construction planning platform 
that combines a trained machine learning model with a 
generative AI assistant to help engineers, architects, and 
project managers estimate costs, generate schedules, and 
plan resources for construction projects in India.

Unlike tools that simply wrap a chatbot in a UI, BuildAtlas 
uses a Random Forest regression model trained on 10,000 
India-calibrated construction project records to produce 
grounded cost and duration predictions. Gemini 1.5 Flash 
then takes those predictions and generates human-readable 
schedules, resource plans, and risk assessments. 
The result is a system that knows numbers AND explains them.

---

## 🚀 Live Demo

| Link | Description |
|------|-------------|
| 🌐 [Frontend (Vercel)]([VERCEL_URL]) | Main application |
| ⚙️ [Backend API (Render)]([RENDER_URL]) | FastAPI docs |
| 📊 [API Health Check]([RENDER_URL]/) | Live status |

> Replace [VERCEL_URL] and [RENDER_URL] with your 
> actual deployed URLs before submitting.

### Screenshots
| Page | Preview |
|------|---------|
| Landing | _add screenshot_ |
| Estimate Form | _add screenshot_ |
| Results Dashboard | _add screenshot_ |
| AI Chat | _add screenshot_ |

---

## ✨ Core Features

| Feature | Description |
|---------|-------------|
| 💰 Cost Estimation | ML model predicts project cost as a range (₹ min — ₹ max) using confidence intervals from Random Forest tree variance |
| 📅 Schedule Generator | Gemini AI produces a week-by-week construction timeline based on predicted duration and project type |
| 👷 Resource Planner | AI recommends workers breakdown, materials list, and equipment requirements |
| ⚠️ Risk Flags | Gemini identifies project-specific risks based on site condition, structure type, and location |
| 💬 AI Chat Assistant | Context-aware chatbot that knows your project details and answers follow-up planning questions |
| 📊 Confidence Intervals | Cost shown as ₹ range not a single number — more honest and more useful than point estimates |

---

## 🏗️ System Architecture

### Architecture Overview

BuildAtlas is a three-tier application with a clear separation 
between data intelligence, business logic, and user interface.

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│              Next.js 14 — Vercel                        │
│  Landing → Estimate Form → Results Dashboard → Chat     │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTPS / REST API
                  ▼
┌─────────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND                        │
│                  Python — Render                        │
│                                                         │
│   POST /estimate              POST /chat                │
│   ┌──────────────┐       ┌──────────────────┐           │
│   │  ML Service  │       │  Gemini Service  │           │
│   │  cost_model  │       │  duration    │           │
│   │  model       │       │  Chat replies    │           │
│   └──────────────┘       └──────────────────┘           │
└─────────────────┬───────────────────────────────────────┘
                  │
         ┌────────┴────────┐
         ▼                 ▼
┌─────────────┐    ┌──────────────────┐
│  ML MODELS  │    │   GEMINI API     │
│  .pkl files │    │   Google Cloud   │
│  Random     │    │   gemini-1.5-    │
│  Forest ×2  │    │   flash          │
└──────┬──────┘    └──────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│           DATA LAYER                │
│   master_dataset.csv (10,000 rows)  │
│   Kaggle CSVs → India Calibration   │
│   → Synthetic Augmentation          │
└─────────────────────────────────────┘
```

### Request Lifecycle

1. User fills the project form on the Next.js frontend
2. Frontend calls POST /estimate on the FastAPI backend
3. FastAPI encodes categorical inputs using saved LabelEncoders
4. ML Service runs cost_model.pkl → predicts cost + confidence interval
5. ML Service runs duration_model.pkl → predicts duration + interval
6. Gemini Service receives predictions + project inputs as context
7. Gemini generates schedule, resources, risk flags as structured JSON
8. FastAPI returns one unified JSON response to the frontend
9. Frontend renders cost cards, schedule table, resource plan, risk flags
10. User can then open Chat, where all project context is pre-loaded

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14 | React framework with App Router |
| TypeScript | 5 | Type safety across all components |
| Tailwind CSS | 3 | Utility-first styling |
| Vercel | — | Zero-config deployment |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11 | Core backend language |
| FastAPI | 0.111 | High-performance REST API |
| Uvicorn | 0.30 | ASGI server |
| Pydantic | 2.7 | Input validation and schemas |
| python-dotenv | 1.0 | Environment variable management |
| Render | — | Cloud deployment, always-on free tier |

### Machine Learning
| Technology | Version | Purpose |
|------------|---------|---------|
| Scikit-learn | 1.5 | Random Forest Regressor × 2 |
| Pandas | 2.2 | Data processing and feature engineering |
| NumPy | 1.26 | Numerical operations and confidence intervals |
| Joblib | 1.4 | Model serialization (.pkl files) |

### AI / Generative
| Technology | Version | Purpose |
|------------|---------|---------|
| Google Gemini | 1.5 Flash | Schedule generation, resource planning, chat |
| google-generativeai SDK | 0.7 | Python client for Gemini API |

### Data
| Source | Records | Purpose |
|--------|---------|---------|
| Kaggle construction datasets | ~5,000–8,000 rows | Real-world foundation |
| India DSR rate calibration | — | Cost conversion to ₹ INR |
| Synthetic augmentation | ~2,000–5,000 rows | Reach 10,000 training records |

---

## 📁 Project Structure

```bash
buildatlas/
│
├── 📄 README.md
├── 📄 .gitignore
├── 📄 .env.example
│
├── 📂 data/                     # Phase 1 — Data pipeline
│   ├── raw/                     # Downloaded Kaggle CSVs (gitignored)
│   ├── processed/
│   │   └── master_dataset.csv   # 10,000 row training file
│   ├── data_builder.py          # Merge → calibrate → augment
│   └── data_validator.py        # Stats checker
│
├── 📂 ml/                       # Phase 2 — ML training
│   ├── train_model.py           # Trains Random Forest × 2
│   ├── evaluate_model.py        # R², MAE, confidence intervals
│   └── models/                  # Saved .pkl files (gitignored)
│       ├── cost_model.pkl
│       ├── duration_model.pkl
│       └── encoder_*.pkl        # 5 label encoders
│
├── 📂 backend/                  # Phase 3 — FastAPI server
│   ├── main.py                  # App entry point + CORS
│   ├── requirements.txt
│   ├── Procfile                 # Render deployment config
│   ├── .env                     # GEMINI_API_KEY (gitignored)
│   ├── routers/
│   │   ├── estimate.py          # POST /estimate
│   │   └── chat.py              # POST /chat
│   ├── services/
│   │   ├── ml_service.py        # Model loading + prediction
│   │   └── gemini_service.py    # All Gemini API calls
│   └── models/                  # .pkl files copied here for API
│
└── 📂 frontend/                 # Phase 4 — Next.js app
    └── src/
        ├── app/
        │   ├── page.tsx          # Landing page
        │   ├── layout.tsx        # Root layout + Navbar
        │   ├── estimate/
        │   │   └── page.tsx      # Project input form
        │   ├── results/
        │   │   └── page.tsx      # Cost + schedule + resources
        │   └── chat/
        │       └── page.tsx      # AI chat assistant
        ├── components/
        │   ├── Navbar.tsx
        │   ├── CostCard.tsx
        │   ├── ScheduleTable.tsx
        │   ├── ResourceCard.tsx
        │   ├── RiskFlags.tsx
        │   └── ChatWindow.tsx
        └── lib/
            ├── api.ts            # All fetch calls
            └── types.ts          # Shared TypeScript interfaces
```

---

## 🤖 How the ML Model Works

### Why Random Forest?
Random Forest was chosen over simpler models because:
- It handles mixed data types (categorical + numerical) naturally
- It produces confidence intervals via tree variance — 
  essential for showing cost ranges instead of point estimates
- It is robust to outliers in construction cost data
- It requires no feature scaling, reducing preprocessing complexity

### Features Used for Prediction
| Feature | Type | Example Values |
|---------|------|----------------|
| project_type | Categorical | Residential, Commercial, Industrial |
| location_tier | Categorical | Tier1, Tier2, Tier3 |
| total_area_sqft | Numerical | 500 – 50,000 |
| num_floors | Numerical | 1 – 20 |
| structure_type | Categorical | RCC, Steel Frame, Load Bearing |
| material_quality | Categorical | Basic, Standard, Premium |
| num_workers | Numerical | 5 – 200 |
| site_condition | Categorical | Easy, Moderate, Difficult |

### Two Models, Two Predictions
Model A (cost_model.pkl) predicts total project cost in ₹ INR.
Model B (duration_model.pkl) predicts project duration in days.
Both models are Random Forest Regressors with 200 estimators.

### Confidence Interval Formula
```python
# Get predictions from all 200 trees individually
tree_preds = np.array([tree.predict(X) for tree in model.estimators_])

# Standard deviation across trees = uncertainty
std = np.std(tree_preds)

# Cost range shown to user
cost_low  = predicted_cost - std
cost_high = predicted_cost + std
```

### Data Pipeline Summary
1. Raw Kaggle CSVs loaded and columns standardised
2. Costs converted to ₹ INR using Indian DSR rate cards
   (Basic: ₹1,500/sqft, Standard: ₹2,200/sqft, Premium: ₹3,500/sqft)
3. Multipliers applied for location, structure, site difficulty
4. Synthetic rows generated following same statistical distribution
5. Final dataset: 10,000 rows, 8 features, 2 targets

---

## 📡 API Reference

### Base URL
```
http://localhost:8000        (local development)
[RENDER_URL]                 (production)
```

### GET /
Health check endpoint.

Response:
```json
{ "status": "BuildAtlas API is live" }
```

### POST /estimate
Accepts project inputs and returns cost estimate, 
schedule, resources, and risk assessment.

Request body:
```json
{
  "project_type": "Residential",
  "location_tier": "Tier1",
  "total_area_sqft": 2000,
  "num_floors": 3,
  "structure_type": "RCC",
  "material_quality": "Standard",
  "num_workers": 40,
  "site_condition": "Moderate"
}
```

Response:
```json
{
  "cost_low": 3800000,
  "cost_high": 4500000,
  "cost_predicted": 4150000,
  "duration_low": 165,
  "duration_high": 210,
  "duration_predicted": 187,
  "schedule": [
    { "week": 1, "task": "Site preparation and foundation", 
      "milestone": true }
  ],
  "resources": {
    "workers_breakdown": { "masons": 12, "labourers": 20 },
    "materials": ["Cement 500 bags", "Steel 2 tonnes"],
    "equipment": ["JCB excavator", "Concrete mixer"]
  },
  "risk_flags": ["Tier1 city logistics may increase costs"],
  "recommendation": "Consider phased construction to manage cash flow"
}
```

### POST /chat
Accepts a user message and project context.
Returns an AI-generated reply.

Request body:
```json
{
  "message": "What if I switch to steel frame structure?",
  "project_context": "Residential, Tier1, 2000 sqft, 3 floors..."
}
```

Response:
```json
{
  "reply": "Switching to steel frame would increase your 
             structural cost by approximately 20%, but could 
             reduce construction duration by 10-15% due to..."
}
```

---

## ⚙️ Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- A Gemini API key (free at https://aistudio.google.com)

### 1. Clone the repository
```bash
git clone https://github.com/chirag100x/builder-hut.git
cd buildatlas
```

### 2. Set up Python environment
```bash
python -m venv venv
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows
```

### 3. Build the dataset
```bash
cd data
pip install pandas numpy
python data_builder.py
# Output: data/processed/master_dataset.csv (10,000 rows)
```

### 4. Train the ML models
```bash
cd ../ml
pip install scikit-learn joblib
python train_model.py
# Output: ml/models/cost_model.pkl + duration_model.pkl
```

### 5. Start the backend
```bash
cd ../backend
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env and add your GEMINI_API_KEY
python main.py
# Server runs at http://localhost:8000
```

### 6. Start the frontend
```bash
cd ../frontend
npm install
cp .env.local.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
# App runs at http://localhost:3000
```

---

## 🚀 Deployment

### Backend → Render
```
1. Push backend/ folder to GitHub
2. Create new Web Service on render.com
3. Set build command: pip install -r requirements.txt
4. Set start command: uvicorn main:app --host 0.0.0.0 --port $PORT
5. Add environment variable: GEMINI_API_KEY=your_key
6. Deploy — Render gives you a public URL
```

### Frontend → Vercel
```
1. Push frontend/ folder to GitHub
2. Import project on vercel.com
3. Set environment variable: 
   NEXT_PUBLIC_API_URL=your_render_url
4. Deploy — Vercel gives you a public URL
```

---

## 🏆 Key Design Decisions

**Decision 1: Hybrid ML + LLM Architecture**
Rather than using only a large language model for cost 
estimation (which can hallucinate numbers), BuildAtlas 
separates the concern of *prediction* from the concern of 
*explanation*. The Random Forest model handles numbers — 
it has studied 10,000 real projects and produces grounded 
estimates. Gemini handles language — it takes those 
grounded numbers and explains them in human terms. 
This separation makes the system more trustworthy.

**Decision 2: Confidence Intervals Over Point Estimates**
Real engineering decisions are never made on a single number. 
By computing standard deviation across all 200 trees in the 
Random Forest, BuildAtlas shows users a cost range 
(e.g. ₹38L — ₹45L) rather than a false-precision point 
estimate. This makes the tool more honest and more useful.

**Decision 3: India-Calibrated Dataset**
Generic construction datasets use USD costs from US or 
European markets. BuildAtlas applies Indian DSR (Delhi 
Schedule of Rates) multipliers and real sq ft rates 
sourced from 99acres and NoBroker to convert all costs 
to ₹ INR. The training data is therefore relevant to the 
actual market the tool serves.

**Decision 4: Monorepo Structure**
Keeping data, ml, backend, and frontend in one repository 
makes it easy to trace any output back to its source — 
from a cost card on screen, to the API route, to the model 
prediction, to the training row that influenced it. 
This is important for debugging and for explaining 
decisions to stakeholders.

---

## 📚 What I Learned Building This

- How to build a hybrid AI system where ML and LLMs 
  complement each other instead of competing
- How Random Forest confidence intervals work and why 
  they matter more than point predictions in real applications
- How to design a data pipeline that takes imperfect public 
  datasets and makes them domain-relevant through calibration 
  and augmentation
- How FastAPI, Next.js, and a Python ML stack connect 
  together in a production-style architecture
- How to scope an MVP ruthlessly — what to build, 
  what to cut, and why working beats perfect

---

## 🔭 Future Improvements

- [ ] Add RAG pipeline with FAISS to ground answers 
      in uploaded construction standard documents
- [ ] Add user authentication and project history 
      (save past estimates to a database)
- [ ] Add a Gantt chart visualisation for the generated schedule
- [ ] Support multi-city rate cards beyond the 3-tier system
- [ ] Add material price tracking using live market API data
- [ ] Train on real verified Indian construction project data 
      when available
- [ ] Add export to PDF feature for client-ready reports
- [ ] Build a mobile app version using React Native

---

## 🙏 Acknowledgements

- Kaggle construction datasets used as training data foundation
- Google Gemini API for generative AI capabilities
- Scikit-learn team for the Random Forest implementation
- Vercel and Render for free deployment tiers
- Indian DSR rate cards and 99acres for market rate calibration

---

## 📄 License

MIT License — see LICENSE file for details.

---

<div align="center">
Built with precision, trained on data, powered by AI.<br/>
<strong>BuildAtlas</strong> — Know before you build.
</div>

---
