import { get } from '../utils/fetch.js';
import { config } from '../config.js';

export const name = '/zr-weather';
export const description = 'Get current weather details for a city';

export const handler = async ({ command, ack, say }) => {
  await ack();
  
  const city = command.text ? command.text.trim() : '';
  if (!city) {
    await say('plz specify a city name (e.g., /zr-weather Tokyo or /zr-weather Mumbai)');
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${config.keys.weather}&units=metric`;
  const data = await get(url);

  if (!data) {
    await say(`could not find weather data for "${city}"  plz check spelling or try another city`);
    return;
  }

  const temp = data.main?.temp;
  const condition = data.weather?.[0]?.description || 'unknown';
  const humidity = data.main?.humidity;
  const windSpeed = data.wind?.speed;

  await say([
    `Weather in ${data.name}, ${data.sys?.country}:`,
    `Temperature: ${temp}°C`,
    `Condition: ${condition}`,
    `Humidity: ${humidity}%`,
    `Wind Speed: ${windSpeed} m/s`
  ].join('\n'));
};
