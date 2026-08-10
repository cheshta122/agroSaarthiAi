import pandas as pd

# Load merged dataset
df = pd.read_csv("data/processed/kcc_haryana_merged.csv")

print("=" * 50)
print("DATASET OVERVIEW")
print("=" * 50)

print("\nShape:")
print(df.shape)

print("\nColumn Names:")
print(df.columns.tolist())

print("\nFirst 5 Rows:")
print(df.head())

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDuplicate Rows:")
print(df.duplicated().sum())

print("\nDataset Info:")
print(df.info())