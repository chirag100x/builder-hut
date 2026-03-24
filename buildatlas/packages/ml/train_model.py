import os
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error

# Helper paths
base_dir = os.path.dirname(__file__)
data_path = os.path.join(base_dir, "../data/processed/master_dataset.csv")
models_dir = os.path.join(base_dir, "models")
os.makedirs(models_dir, exist_ok=True)

# STEP 1 — LOAD AND ENCODE DATA
try:
    df = pd.read_csv(data_path)
except FileNotFoundError:
    df = pd.read_csv("master_dataset.csv")

categorical_cols = ["project_type", "location_tier", "structure_type", "material_quality", "site_condition"]

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    # Save each encoder using joblib
    joblib.dump(le, os.path.join(models_dir, f"encoder_{col}.pkl"))

# STEP 2 — DEFINE FEATURES AND TARGETS
X = df[["project_type", "location_tier", "total_area_sqft", "num_floors", 
        "structure_type", "material_quality", "num_workers", "site_condition"]]
y1 = df["cost_inr"]
y2 = df["duration_days"]

# STEP 3 — SPLIT DATA
X_train, X_test, y1_train, y1_test, y2_train, y2_test = train_test_split(
    X, y1, y2, test_size=0.2, random_state=42
)

# STEP 4 — TRAIN TWO RANDOM FOREST MODELS
cost_model = RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)
cost_model.fit(X_train, y1_train)

duration_model = RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)
duration_model.fit(X_train, y2_train)

# STEP 5 — EVALUATE BOTH MODELS
y1_pred = cost_model.predict(X_test)
print("COST MODEL:")
print("R2 score:", r2_score(y1_test, y1_pred))
print("Mean Absolute Error:", mean_absolute_error(y1_test, y1_pred))

y2_pred = duration_model.predict(X_test)
print("\nDURATION MODEL:")
print("R2 score:", r2_score(y2_test, y2_pred))
print("Mean Absolute Error:", mean_absolute_error(y2_test, y2_pred))

# STEP 6 — CALCULATE CONFIDENCE INTERVALS
cost_tree_preds = np.array([tree.predict(X_test.values) for tree in cost_model.estimators_])
cost_std = np.std(cost_tree_preds, axis=0)
print(f"Average cost uncertainty: ±{np.mean(cost_std):.2f}")

duration_tree_preds = np.array([tree.predict(X_test.values) for tree in duration_model.estimators_])
duration_std = np.std(duration_tree_preds, axis=0)
print(f"Average duration uncertainty: ±{np.mean(duration_std):.2f}")

# STEP 7 — SAVE MODELS
joblib.dump(cost_model, os.path.join(models_dir, "cost_model.pkl"))
joblib.dump(duration_model, os.path.join(models_dir, "duration_model.pkl"))
print("\nModels saved successfully")
