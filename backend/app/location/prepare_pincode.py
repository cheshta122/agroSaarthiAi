import pandas as pd

df = pd.read_csv("data/raw/haryana_pincode.csv")

df["District"] = (
    df["Division"]
    .str.replace(" Division", "", regex=False)
    .str.replace("HQ Region ", "", regex=False)
)

df = df[
    [
        "Pincode",
        "District",
        "OfficeName",
        "State"
    ]
]

df.drop_duplicates(subset="Pincode", inplace=True)

df.to_csv(
    "backend/app/data/haryana_pincode_clean.csv",
    index=False
)

print(df.head())
print(df.shape)