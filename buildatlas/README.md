# BuildAtlas — Smart Construction Intelligence Platform

## Project Structure
- /packages/data — data pipeline scripts and datasets
- /packages/ml — model training and saved model artifacts
- /apps/backend — FastAPI server (Python)
- /apps/frontend — Next.js 14 application (TypeScript)

## Setup Order
1. Run packages/data/data_builder.py to generate master_dataset.csv
2. Run packages/ml/train_model.py to train and save ML models
3. Run apps/backend/main.py to start FastAPI server
4. Run npm install at root, then `npm run dev` to start apps

## Environment Variables
Copy .env.example and fill in values:
- GEMINI_API_KEY: get from https://aistudio.google.com
- NEXT_PUBLIC_API_URL: your deployed Render backend URL
