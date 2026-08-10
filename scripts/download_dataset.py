import requests

API_KEY = "579b464db66ec23bdd000001150e440b51bd43fc6f1b7d95bd25597b"

URL = "https://api.data.gov.in/resource/cef25fe2-9231-4128-8aec-2c948fedd43f"

headers = {
    "X-Api-Key": API_KEY
}

params = {
    "format": "json",
    "limit": 10,
    "offset": 0
}

response = requests.get(URL, headers=headers, params=params)

print("Status:", response.status_code)
print(response.text)