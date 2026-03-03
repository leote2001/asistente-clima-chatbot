export async function getWeather(city: string) {
 const geocodingApi = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
 const geocodingData = await geocodingApi.json();
 if (!geocodingData.results.length) {
    throw new Error("Ciudad no encontrada.");
 }   
 const {longitude, latitude, name, country, timezone, country_code} = geocodingData.results[0];

 const weatherApi = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_hours,wind_speed_10m_max&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,wind_speed_10m&timezone=auto`);
 const weatherData = await weatherApi.json();
 const {current, daily, current_units, daily_units} = weatherData; 
 return {city: name, country, country_code, timezone, daily, daily_units, current, current_units};
}