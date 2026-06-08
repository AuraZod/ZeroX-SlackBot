import { get } from '../utils/fetch.js';

export const name = '/zr-fact';
export const description = 'Get a random interesting fact';

const fallbackFacts = [
  "Honey never spoils. You can theoretically eat 3,000-year-old honey.",
  "Dead skin cells are a main ingredient in household dust.",
  "Bananas are curved because they grow towards the sun.",
  "Some cats are allergic to humans.",
  "A day on Venus is longer than a year on Venus.",
  "Wombat poop is cube-shaped, which stops it from rolling away.",
  "Nutmeg is a hallucinogen if consumed in large quantities.",
  "The first computer bug was an actual real moth found in a relay.",
  "Octopuses have three hearts and blue blood.",
  "Sloths can hold their breath longer than dolphins can."
];

export const handler = async ({ command, ack, say }) => {
  await ack();

  const url = 'https://catfact.ninja/fact';
  const data = await get(url);

  if (data && data.fact) {
    await say(`Fact: ${data.fact}`);
    return;
  }

  const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
  await say(`Fact: ${randomFact}`);
};
