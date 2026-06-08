import { askGemini } from '../utils/gemini.js';

export const name = '/zr-roast';
export const description = 'Roast a friend (or yourself) using ZeroX';

export const handler = async ({ command, ack, say }) => {
  await ack();

  const target = command.text ? command.text.trim() : '';
  if (!target) {
    await say('please specify a target (e.g., /zr-roast @username)');
    return;
  }

  const sys = 'You are a funny assistant for a Hack Club community. Write a short, funny, good-natured roast (2-3 lines max) for the given target. Keep it clean, friendly, and absolutely avoid slurs or discriminatory language. Respond in plain text, do not use markdown.';
  const prompt = `Write a roast for: ${target}`;
  const response = await askGemini(sys, prompt);

  if (!response) {
    await say('I was going to roast you, but ZeroX went offline. Consider yourself lucky for now!');
    return;
  }

  await say(`> Roast for ${target}\n\n${response}`);
};
