import pandas as pd

# Load the cleaned pincode data once
df = pd.read_csv("backend/app/data/haryana_pincode_clean.csv")


def get_location(pincode):
    """
    Returns district and office name for a given Haryana pincode.
    """

    try:
        pincode = int(pincode)
    except ValueError:
        return None

    row = df[df["Pincode"] == pincode]

    if row.empty:
        return None

    row = row.iloc[0]

    return {
        "district": row["District"],
        "office": row["OfficeName"]
    }