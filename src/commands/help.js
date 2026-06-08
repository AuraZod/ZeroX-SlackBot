export const name = '/zr-help';
export const description = 'Lists all available commands';

export const handler = async ({ command, ack, say }) => {
  await ack();
  const text = [
    'Available commands:',
    '/zr-ping - Checkout Latency and Respone Time',
    '/zr-help - Lists all available commands',
    '/zr-weather [City Name] - Checkout Weather Realtime',
    '/zr-fact - Get a random interesting fact',
    '/zr-cat - Get a random cute cat image',
    '/zr-joke - Get a random joke',
    '/zr-ask [Question] - Ask the ZeroX assistant a question',
    '/zr-roast [Name/@Mention] - Roast a friend (or yourself) using ZeroX'
  ].join('\n');
  await say(text);
};
