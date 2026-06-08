import { get } from '../utils/fetch.js';

export const name = '/zr-joke';
export const description = 'Get a random joke';

export const handler = async ({ command, ack, say }) => {
  await ack();

  const url = 'https://official-joke-api.appspot.com/random_joke';
  const data = await get(url);

  if (!data || !data.setup || !data.punchline) {
    await say('could not retrieve a joke right now');
    return;
  }

  await say(`${data.setup}\n${data.punchline}`);
};
