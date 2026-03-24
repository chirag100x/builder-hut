# BuildAtlas — Smart Construction Intelligence Platform

## Project Structure
- /data — data pipeline scripts and datasets
- /ml — model training and saved model artifacts
- /backend — FastAPI server (Python)
- /frontend — Next.js 14 application (TypeScript)

## Setup Order
1. Run data/data_builder.py to generate master_dataset.csv
2. Run ml/train_model.py to train and save ML models
3. Run backend/main.py to start FastAPI server
4. Run frontend with npm run dev

## Environment Variables
Copy .env.example and fill in values:
- GEMINI_API_KEY: get from https://aistudio.google.com
- NEXT_PUBLIC_API_URL: your deployed Render backend URL
