from fastapi import APIRouter
from pathlib import Path
import pandas as pd


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# ============================================================
# PATHS
# ============================================================

# Project root = D:\agroSaarthiAi
BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = BASE_DIR / "data" / "raw"

KCC_FILES = [
    DATA_DIR / "kcc_haryana_jan_2023.csv",
    DATA_DIR / "kcc_haryana_jan_2024.csv",
    DATA_DIR / "kcc_haryana_jan_2025.csv",
]

PINCODE_FILE = DATA_DIR / "haryana_pincode.csv"


# ============================================================
# LOAD KCC DATA
# ============================================================

def load_kcc_data():
    dataframes = []

    for file in KCC_FILES:
        if file.exists():
            try:
                df = pd.read_csv(file, low_memory=False)
                dataframes.append(df)
                print(f"Loaded: {file.name} -> {len(df)} records")
            except Exception as e:
                print(f"Error loading {file.name}: {e}")
        else:
            print(f"File not found: {file}")

    if not dataframes:
        return pd.DataFrame()

    combined = pd.concat(
        dataframes,
        ignore_index=True
    )

    # Remove completely empty rows
    combined = combined.dropna(how="all")

    return combined


# ============================================================
# LOAD PINCODE DATA
# ============================================================

def load_pincode_data():
    if not PINCODE_FILE.exists():
        print(f"Pincode file not found: {PINCODE_FILE}")
        return pd.DataFrame()

    try:
        df = pd.read_csv(
            PINCODE_FILE,
            low_memory=False
        )

        print(
            f"Loaded: {PINCODE_FILE.name} -> {len(df)} records"
        )

        return df

    except Exception as e:
        print(f"Error loading pincode file: {e}")
        return pd.DataFrame()


# ============================================================
# HELPER
# ============================================================

def clean_column(df, column):
    """
    Safely clean a dataframe column.
    """
    if column not in df.columns:
        return pd.Series(dtype=str)

    return (
        df[column]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
    )


# ============================================================
# ANALYTICS API
# ============================================================

@router.get("/")
def get_analytics():

    kcc = load_kcc_data()
    pincode = load_pincode_data()

    # --------------------------------------------------------
    # Empty dataset protection
    # --------------------------------------------------------

    if kcc.empty:
        return {
            "status": "error",
            "message": "KCC datasets could not be loaded."
        }

    # --------------------------------------------------------
    # BASIC STATISTICS
    # --------------------------------------------------------

    total_records = len(kcc)

    # District
    if "DistrictName" in kcc.columns:
        district_series = clean_column(
            kcc,
            "DistrictName"
        )

        # Remove invalid district values
        district_series = (
            district_series
            .replace(
                ["0", "nan", "None", ""],
                pd.NA
            )
            .dropna()
        )

    else:
        district_series = pd.Series(
            ["Unknown"] * len(kcc)
        )

    total_districts = (
        district_series
        .replace("Unknown", pd.NA)
        .dropna()
        .nunique()
    )

    # Crop
    if "Crop" in kcc.columns:
        crop_series = clean_column(kcc, "Crop")
    else:
        crop_series = pd.Series(
            ["Unknown"] * len(kcc)
        )

    # Category
    if "Category" in kcc.columns:
        category_series = clean_column(
            kcc,
            "Category"
        )
    else:
        category_series = pd.Series(
            ["Unknown"] * len(kcc)
        )

    # --------------------------------------------------------
    # TOP CROPS
    # --------------------------------------------------------

    crop_counts = (
        crop_series
        .value_counts()
        .head(10)
    )

    top_crops = [
        {
            "crop": str(crop),
            "count": int(count)
        }
        for crop, count in crop_counts.items()
    ]

    # --------------------------------------------------------
    # TOP DISTRICTS
    # --------------------------------------------------------

    district_counts = (
        district_series
        .value_counts()
        .head(22)
    )

    top_districts = [
        {
            "district": str(district),
            "count": int(count)
        }
        for district, count in district_counts.items()
    ]

    # --------------------------------------------------------
    # ALL DISTRICT DATA
    # Useful for heatmap
    # --------------------------------------------------------

    all_district_counts = (
        district_series
        .value_counts()
    )

    district_heatmap = [
        {
            "district": str(district),
            "count": int(count)
        }
        for district, count
        in all_district_counts.items()
    ]

    # --------------------------------------------------------
    # CATEGORY DISTRIBUTION
    # --------------------------------------------------------

    category_counts = (
        category_series
        .value_counts()
        .head(10)
    )

    category_distribution = [
        {
            "category": str(category),
            "count": int(count)
        }
        for category, count
        in category_counts.items()
    ]

    # --------------------------------------------------------
    # YEAR-WISE DATA
    # --------------------------------------------------------

    yearly_data = []

    if "year" in kcc.columns:

        year_series = pd.to_numeric(
            kcc["year"],
            errors="coerce"
        )

        year_counts = (
            year_series
            .dropna()
            .astype(int)
            .value_counts()
            .sort_index()
        )

        yearly_data = [
            {
                "year": int(year),
                "count": int(count)
            }
            for year, count
            in year_counts.items()
        ]

    # --------------------------------------------------------
    # PINCODE STATISTICS
    # --------------------------------------------------------

    total_pincodes = 0
    pincode_districts = 0

    if not pincode.empty:

        # Try to identify pincode column
        pincode_column = None

        for column in pincode.columns:

            normalized = (
                str(column)
                .lower()
                .replace("_", "")
                .replace(" ", "")
            )

            if normalized in [
                "pincode",
                "pincode",
                "pin"
            ]:
                pincode_column = column
                break

        if pincode_column:

            total_pincodes = (
                pincode[pincode_column]
                .dropna()
                .astype(str)
                .str.strip()
                .nunique()
            )

        # Try district column
        district_column = None

        for column in pincode.columns:

            normalized = (
                str(column)
                .lower()
                .replace("_", "")
                .replace(" ", "")
            )

            if "district" in normalized:
                district_column = column
                break

        if district_column:

            pincode_districts = (
                pincode[district_column]
                .dropna()
                .astype(str)
                .str.strip()
                .nunique()
            )

    # --------------------------------------------------------
    # RETURN EVERYTHING
    # --------------------------------------------------------

    return {
        "status": "success",

        "summary": {
            "total_kcc_records": total_records,
            "total_districts": int(total_districts),
            "total_pincodes": int(total_pincodes),
            "pincode_districts": int(pincode_districts)
        },

        "top_crops": top_crops,

        "top_districts": top_districts,

        "district_heatmap": district_heatmap,

        "category_distribution": category_distribution,

        "yearly_queries": yearly_data
    }