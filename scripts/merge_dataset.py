import pandas as pd
import os

# Folder containing raw Excel files
RAW_DATA_PATH = "data/raw"

# List of Excel files
files = [
    "kcc_haryana_jan_2023.csv",
    "kcc_haryana_jan_2024.csv",
    "kcc_haryana_jan_2025.csv"
]
dataframes = []

# Read each Excel file
for file in files:
    file_path = os.path.join(RAW_DATA_PATH, file)

    print(f"Reading {file}...")

    df = pd.read_csv(file_path)

    print(f"Rows: {len(df)}")

    dataframes.append(df)

# Merge all datasets
merged_df = pd.concat(dataframes, ignore_index=True)

print("\n======================")
print("Merged Successfully!")
print("======================")

print(f"Total Rows: {len(merged_df)}")
print(f"Total Columns: {len(merged_df.columns)}")

# Create processed folder if it doesn't exist
os.makedirs("data/processed", exist_ok=True)

# Save merged CSV
merged_df.to_csv(
    "data/processed/kcc_haryana_merged.csv",
    index=False
)

print("\nMerged dataset saved successfully!")