import { get } from '../utils/fetch.js';
import { config } from '../config.js';

export const name = '/zr-cat';
export const description = 'Get a random cute cat image';

export const handler = async ({ command, ack, say }) => {
  await ack();

  const url = `https://api.thecatapi.com/v1/images/search?api_key=${config.keys.cat}`;
  const data = await get(url);

  if (!data || !data[0]?.url) {
    await say('could not retrieve a cat image right now, Plz try again later');
    return;
  }

  const imageUrl = data[0].url;

  await say({
    blocks: [
      {
        type: 'image',
        image_url: imageUrl,
        alt_text: 'cute cat'
      }
    ]
  });
};
