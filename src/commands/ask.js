import { askGemini } from '../utils/gemini.js';

export const name = '/zr-ask';
export const description = 'Ask the ZeroX assistant a question';

export const handler = async ({ command, ack, say }) => {
  await ack();

  const prompt = command.text ? command.text.trim() : '';
  if (!prompt) {
    await say('please specify a question (e.g., /zr-ask what is a hackathon?)');
    return;
  }

  const sys = 'You are ZeroX, a Slack assistant for a Hack Club community. Keep responses concise, plain text, and do not use markdown.';
  const response = await askGemini(sys, prompt);

  if (!response) {
    await say('Sorry, I am having trouble connecting to Gemini at the moment. Please try again in a few seconds!');
    return;
  }

  await say(`> ${prompt}\n\n${response}`);
};
