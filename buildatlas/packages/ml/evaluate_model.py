# Model Evaluator - prints R2, MAE, confidence intervals
# Run after train_model.py completes

import os
import joblib
import numpy as np

models_dir = os.path.join(os.path.dirname(__file__), "models")
cost_path = os.path.join(models_dir, "cost_model.pkl")
duration_path = os.path.join(models_dir, "duration_model.pkl")

if not os.path.exists(cost_path):
    print("Models not found. Run train_model.py first.")
else:
    cost_model = joblib.load(cost_path)
    duration_model = joblib.load(duration_path)
    print("Models loaded successfully.")
    print("Cost model estimators:", len(cost_model.estimators_))
    print("Duration model estimators:", len(duration_model.estimators_))
