import { post } from './fetch.js';
import { config } from '../config.js';

export const askGemini = async (systemContext, userMessage) => {
  if (!config.keys.gemini) {
    console.error('gemini API key is missing');
    return null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.keys.gemini}`;

  const body = {
    contents: [
      {
        parts: [
          { text: userMessage }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        { text: systemContext }
      ]
    }
  };

  const data = await post(url, body, {
    headers: { 'Content-Type': 'application/json' }
  });

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
};
