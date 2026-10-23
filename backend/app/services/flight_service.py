import json
import os

def get_flight_options(destination: str = "United Kingdom") -> list:
    mock_file = os.path.join(os.path.dirname(__file__), "..", "data", "mock_flights.json")
    if os.path.exists(mock_file):
        with open(mock_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("flights", [])
    return []
