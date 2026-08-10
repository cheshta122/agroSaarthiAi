import pandas as pd

# Load cleaned dataset
df = pd.read_csv("data/processed/kcc_clean.csv")

documents = []

for _, row in df.iterrows():
    document = {
        "text": f"""
Farmer Query:
{row['QueryText']}

Expert Answer:
{row['KccAns']}

Crop:
{row['Crop']}

Category:
{row['Category']}

District:
{row['DistrictName']}

Block:
{row['BlockName']}
""".strip(),
        "metadata": {
            "crop": row["Crop"],
            "district": row["DistrictName"],
            "block": row["BlockName"],
            "category": row["Category"],
            "year": row["year"]
        }
    }

    documents.append(document)

print("Total Documents:", len(documents))

print("\nSample Document:\n")
print(documents[0]["text"])

print("\nMetadata:\n")
print(documents[0]["metadata"])