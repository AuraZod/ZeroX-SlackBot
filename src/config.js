import dotenv from 'dotenv';

dotenv.config();

const required = [
  'SLACK_BOTTOKEN',
  'SLACK_APPTOKEN',
  'GEMINI_API',
  'WEATHER_API',
  'CAT_API'
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`missing required environment variable: ${key}`);
    process.exit(1);
  }
}

export const config = {
  slack: {
    botToken: process.env.SLACK_BOTTOKEN,
    appToken: process.env.SLACK_APPTOKEN,
  },
  db: {
    path: process.env.DB_PATH || 'bot.db',
  },
  keys: {
    gemini: process.env.GEMINI_API,
    weather: process.env.WEATHER_API,
    cat: process.env.CAT_API,
  }
};
