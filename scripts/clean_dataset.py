import pandas as pd

# Load merged dataset
df = pd.read_csv("data/processed/kcc_haryana_merged.csv")

print("Original Shape:", df.shape)

# 1. Remove the Season column (it's completely empty)
df = df.drop(columns=["Season"])

# 2. Remove rows where QueryText or KccAns is missing
df = df.dropna(subset=["QueryText", "KccAns"])

# 3. Remove extra spaces
df["QueryText"] = df["QueryText"].astype(str).str.strip()
df["KccAns"] = df["KccAns"].astype(str).str.strip()

# 4. Remove duplicate questions (keep the first occurrence)
df = df.drop_duplicates(subset=["QueryText"])

print("Cleaned Shape:", df.shape)

# Save cleaned dataset
df.to_csv("data/processed/kcc_clean.csv", index=False)

print("\n✅ Cleaned dataset saved successfully!")