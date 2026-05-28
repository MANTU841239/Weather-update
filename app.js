async function getWeather() {
    const city = document.getElementById("city").value;

    const res = await fetch(`https://your-backend-name.onrender.com/weather?city=${city}`);
    const data = await res.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    const current = data.current;
    const air = data.air;
    const daily = data.forecast.daily;

    updateLeftPanel(current);
    updateUV(air);
    updateWind(current);
    updateSun(current);
    updateHumidity(current);
    updateVisibility(current);
    updateAQI(air);
    updateForecast(daily);
    updateHourlyChart(daily);
}


/* ---------------- LEFT PANEL ---------------- */
function updateLeftPanel(d) {
    document.getElementById("left-info").innerHTML = `
        <h1 class="text-3xl font-bold">${d.name}</h1>
        <p class="text-xl mt-3">${d.main.temp}°C</p>
        <p>${d.weather[0].description}</p>
    `;
}


/* ---------------- HOURLY CHART ---------------- */
let hourChartObj = null;

function updateHourlyChart(days) {
    const labels = days.map(d => d.date);
    const temps = days.map(d => d.temp);

    if (hourChartObj) hourChartObj.destroy();

    hourChartObj = new Chart(document.getElementById("hourChart"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Daily Temperature (°C)",
                data: temps,
                borderWidth: 2
            }]
        }
    });
}


/* ---------------- UV INDEX ---------------- */
function updateUV(air) {
    const aqi = air.list[0].main.aqi;
    const uv = aqi * 2; // approximate UV

    document.getElementById("uv").innerHTML = `
        <p class="text-2xl font-bold">${uv}</p>
    `;
}


/* ---------------- WIND ---------------- */
function updateWind(d) {
    document.getElementById("wind").innerHTML = `
        <p class="text-2xl font-bold">${d.wind.speed} m/s</p>
    `;
}


/* ---------------- SUNRISE / SUNSET ---------------- */
function updateSun(d) {
    const sunrise = new Date(d.sys.sunrise * 1000).toLocaleTimeString();
    const sunset  = new Date(d.sys.sunset * 1000).toLocaleTimeString();

    document.getElementById("sun").innerHTML = `
        <p>Sunrise: ${sunrise}</p>
        <p>Sunset: ${sunset}</p>
    `;
}


/* ---------------- HUMIDITY ---------------- */
function updateHumidity(d) {
    document.getElementById("humidity").innerHTML = `
        <p class="text-2xl font-bold">${d.main.humidity}%</p>
    `;
}


/* ---------------- VISIBILITY ---------------- */
function updateVisibility(d) {
    document.getElementById("visibility").innerHTML = `
        <p class="text-2xl font-bold">${(d.visibility / 1000).toFixed(1)} km</p>
    `;
}


/* ---------------- AIR QUALITY ---------------- */
function updateAQI(air) {
    const aqi = air.list[0].main.aqi;
    const levels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

    document.getElementById("aqi").innerHTML = `
        <p class="text-2xl font-bold">${aqi} - ${levels[aqi - 1]}</p>
    `;
}


/* ---------------- 7-DAY FORECAST ---------------- */
function updateForecast(days) {
    let html = `<h2 class="text-xl font-bold mb-3">5-Day Forecast</h2><div class="grid grid-cols-5 gap-4">`;

    days.forEach(d => {
        html += `
            <div class="p-3 border rounded text-center">
                <p class="font-bold">${d.date}</p>
                <p>${d.temp}°C</p>
                <p>${d.weather}</p>
            </div>
        `;
    });

    html += "</div>";
    document.getElementById("forecast").innerHTML = html;
}


