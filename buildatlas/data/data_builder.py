import pandas as pd
import numpy as np
import os

# STEP 1 — CREATE SYNTHETIC BASE DATA
num_rows = 10000

project_types = ["Residential", "Commercial", "Industrial", "Infrastructure"]
location_tiers = ["Tier1", "Tier2", "Tier3"]
structure_types = ["RCC", "Steel Frame", "Load Bearing", "Prefabricated"]
material_qualities = ["Basic", "Standard", "Premium"]
site_conditions = ["Easy", "Moderate", "Difficult"]

df = pd.DataFrame({
    'project_type': np.random.choice(project_types, num_rows),
    'location_tier': np.random.choice(location_tiers, num_rows),
    'total_area_sqft': np.random.randint(500, 50001, num_rows),
    'num_floors': np.random.randint(1, 21, num_rows),
    'structure_type': np.random.choice(structure_types, num_rows),
    'material_quality': np.random.choice(material_qualities, num_rows),
    'num_workers': np.random.randint(5, 201, num_rows),
    'site_condition': np.random.choice(site_conditions, num_rows)
})

# STEP 2 — CALCULATE REALISTIC TARGET COLUMNS

# COST CALCULATION RULES (cost_inr)
base_rate_map = {"Basic": 1500, "Standard": 2200, "Premium": 3500}
df['base_rate'] = df['material_quality'].map(base_rate_map)
df['base_cost'] = df['base_rate'] * df['total_area_sqft']

loc_mult_map = {"Tier1": 1.3, "Tier2": 1.0, "Tier3": 0.8}
struc_mult_map = {"Steel Frame": 1.2, "RCC": 1.0, "Load Bearing": 0.9, "Prefabricated": 1.1}
site_mult_map = {"Difficult": 1.15, "Moderate": 1.05, "Easy": 1.0}

df['cost_mult_loc'] = df['location_tier'].map(loc_mult_map)
df['cost_mult_struc'] = df['structure_type'].map(struc_mult_map)
df['cost_mult_site'] = df['site_condition'].map(site_mult_map)

df['cost_mult_floors'] = np.where(df['num_floors'] > 5, 1 + df['num_floors'] * 0.02, 1.0)

df['final_cost'] = df['base_cost'] * df['cost_mult_loc'] * df['cost_mult_struc'] * df['cost_mult_site'] * df['cost_mult_floors']
df['cost_noise'] = np.random.uniform(0.92, 1.08, num_rows)
df['cost_inr'] = np.round((df['final_cost'] * df['cost_noise']) / 1000) * 1000

# DURATION CALCULATION RULES (duration_days)
df['base_duration'] = df['total_area_sqft'] / 40.0

df['dur_mult_floors'] = 1 + df['num_floors'] * 0.05
dur_site_mult_map = {"Difficult": 1.2, "Moderate": 1.1, "Easy": 1.0}
df['dur_mult_site'] = df['site_condition'].map(dur_site_mult_map)

df['dur_mult_workers'] = 50.0 / df['num_workers']

dur_struc_mult_map = {"Steel Frame": 0.9, "Prefabricated": 0.85, "RCC": 1.0, "Load Bearing": 1.1}
df['dur_mult_struc'] = df['structure_type'].map(dur_struc_mult_map)

df['final_duration'] = df['base_duration'] * df['dur_mult_floors'] * df['dur_mult_site'] * df['dur_mult_workers'] * df['dur_mult_struc']
df['dur_noise'] = np.random.uniform(0.90, 1.10, num_rows)
df['duration_days'] = np.round(df['final_duration'] * df['dur_noise'])
df['duration_days'] = np.clip(df['duration_days'], 30, 1500)

cols_to_keep = [
    'project_type', 'location_tier', 'total_area_sqft', 'num_floors',
    'structure_type', 'material_quality', 'num_workers', 'site_condition',
    'cost_inr', 'duration_days'
]
df = df[cols_to_keep]

# STEP 3 — SAVE THE FILE
# Save the final dataframe to master_dataset.csv in the processed directory 
# to be compatible with Phase 0 data_validator.py and project structure.
output_path = os.path.join(os.path.dirname(__file__), "processed", "master_dataset.csv")
df.to_csv(output_path, index=False)
# Also save to current working directory to strictly fulfill the "in the current working directory" prompt,
# though we run it from the root mostly, let's just create a symlink or save it twice if needed.
# Actually, I'll just save it to processed folder and output where we saved it.
# Wait, the prompt says "Save the final dataframe to master_dataset.csv in the current working directory."
df.to_csv("master_dataset.csv", index=False)

print(f"Shape of the dataset: {df.shape}")
print("First 5 rows:")
print(df.head(5))
print(f"Cost INR - Min: {df['cost_inr'].min()}, Max: {df['cost_inr'].max()}, Mean: {df['cost_inr'].mean():.2f}")
print(f"Duration Days - Min: {df['duration_days'].min()}, Max: {df['duration_days'].max()}, Mean: {df['duration_days'].mean():.2f}")
print("Value counts for project_type:")
print(df['project_type'].value_counts())
