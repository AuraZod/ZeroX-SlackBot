import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const commandsDir = path.join(dirname, 'commands');

export const loadCommands = async (app) => {
  const files = await fs.readdir(commandsDir);

  for (const file of files) {
    if (!file.endsWith('.js')) continue;

    const filePath = path.join(commandsDir, file);
    const fileUrl = pathToFileURL(filePath).href;
    const cmd = await import(fileUrl);

    if (cmd.name && cmd.handler) {
      app.command(cmd.name, async (args) => {
        const originalSay = args.say;
        args.say = async (message) => {
          if (cmd.name !== '/roast') {
            if (typeof message === 'string') {
              return await args.respond({ text: message });
            }
            const { response_type, ...rest } = message;
            return await args.respond(rest);
          }

          try {
            return await originalSay(message);
          } catch (err) {
            if (err.code === 'slack_webapi_platform_error' && err.data?.error === 'not_in_channel') {
              if (typeof message === 'string') {
                return await args.respond({ text: message, response_type: 'in_channel' });
              }
              return await args.respond({ ...message, response_type: 'in_channel' });
            }
            throw err;
          }
        };
        return await cmd.handler(args);
      });
    }
  }
};
