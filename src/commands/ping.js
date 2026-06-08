export const name = '/zr-ping';
export const description = 'Test latency and get a pong response, Find Ping and Message Response Time';

export const handler = async ({ command, ack, respond }) => {
  await ack();
  const start = Date.now();
  await respond({ text: 'calculating latency...' });
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms`, replace_original: true });
};
