# Data Validator - prints stats and checks for nulls
# Run after data_builder.py completes

import pandas as pd
import os

path = os.path.join(os.path.dirname(__file__), "processed/master_dataset.csv")
if not os.path.exists(path):
    print("master_dataset.csv not found. Run data_builder.py first.")
else:
    df = pd.read_csv(path)
    print("Shape:", df.shape)
    print("Nulls:\n", df.isnull().sum())
    print("Sample:\n", df.head(3))
