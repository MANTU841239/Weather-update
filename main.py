from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "8b44eb9bacb7e23ecb505eafcec535b5"  # add your key here


@app.get("/weather")
def get_weather(city: str):
    try:
        # 1️⃣ Current Weather
        url_current = (
            f"https://api.openweathermap.org/data/2.5/weather?"
            f"q={city}&appid={API_KEY}&units=metric"
        )
        current = requests.get(url_current).json()

        if current.get("cod") == "404":
            return {"error": "City Not Found"}

        lat = current["coord"]["lat"]
        lon = current["coord"]["lon"]

        # 2️⃣ Air Quality (works on free tier)
        url_air = (
            f"https://api.openweathermap.org/data/2.5/air_pollution?"
            f"lat={lat}&lon={lon}&appid={API_KEY}"
        )
        air = requests.get(url_air).json()

        # 3️⃣ Forecast (free endpoint — NOT OneCall)
        url_forecast = (
            f"https://api.openweathermap.org/data/2.5/forecast?"
            f"lat={lat}&lon={lon}&units=metric&appid={API_KEY}"
        )
        forecast = requests.get(url_forecast).json()

        # Convert forecast (3-hour data → daily)
        daily = []
        used_dates = set()

        for item in forecast.get("list", []):
            date = item["dt_txt"].split(" ")[0]
            if date not in used_dates:
                used_dates.add(date)
                daily.append({
                    "date": date,
                    "temp": item["main"]["temp"],
                    "humidity": item["main"]["humidity"],
                    "wind": item["wind"]["speed"],
                    "weather": item["weather"][0]["description"]
                })

        # Prepare combined JSON
        return {
            "current": current,
            "air": air,
            "forecast": {
                "daily": daily[:5]  # next 5 days
            }
        }

    except Exception as e:
        return {"error": "Server Error", "details": str(e)}










