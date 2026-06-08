import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const commandsDir = path.join(dirname, 'commands');

const handleIncomingMessage = async ({ event, say, client }) => {
  try {
    const text = event.text || '';
    const mentionRegex = /<@(U[A-Z0-9]+)>/;
    const match = text.match(mentionRegex);
    
    let cleanText = '';
    if (match) {
      const mentionIndex = text.indexOf(match[0]);
      const afterMention = text.substring(mentionIndex + match[0].length);
      cleanText = afterMention.replace(/^[:,\-\s]+/, '').trim();
    } else {
      cleanText = text.trim();
    }

    const words = cleanText.split(/\s+/).filter(Boolean);

    if (words.length > 0) {
      const commandWord = words[0].toLowerCase();
      let commandName = commandWord;
      if (!commandName.startsWith('/')) {
        commandName = '/' + commandName;
      }
      if (!commandName.startsWith('/zr-')) {
        commandName = commandName.replace(/^\//, '/zr-');
      }
      const files = await fs.readdir(commandsDir);
      let matchedCmd = null;

      for (const file of files) {
        if (!file.endsWith('.js')) continue;

        const filePath = path.join(commandsDir, file);
        const fileUrl = pathToFileURL(filePath).href;
        const cmd = await import(fileUrl);

        if (cmd.name && cmd.name.toLowerCase() === commandName) {
          matchedCmd = cmd;
          break;
        }
      }

      if (matchedCmd) {
        const restOfText = cleanText.substring(words[0].length).trim();
        const mockCommand = {
          text: restOfText,
          command: commandName,
          user_id: event.user,
          channel_id: event.channel,
        };

        const mockArgs = {
          command: mockCommand,
          ack: async () => {},
          say: async (message) => {
            return await say(message);
          },
          respond: async (message) => {
            if (typeof message === 'string') {
              return await say({ text: message });
            }
            return await say(message);
          },
          client,
          event,
        };

        await matchedCmd.handler(mockArgs);
        return;
      }
    }

    const files = await fs.readdir(commandsDir);
    const list = [];

    for (const file of files) {
      if (!file.endsWith('.js')) continue;

      const filePath = path.join(commandsDir, file);
      const fileUrl = pathToFileURL(filePath).href;
      const cmd = await import(fileUrl);

      if (cmd.name) {
        const desc = cmd.description || 'no description';
        list.push(`${cmd.name} - ${desc}`);
      }
    }

    const info = 'Yoich, Myself ZeroX, need my help with something or just wanna checkout cute cat pics ?.';
    const msg = [
      info,
      '',
      'Available commands:',
      ...list.map(c => `• ${c}`),
    ].join('\n');

    try {
      await say(msg);
    } catch (err) {
      if (err.code === 'slack_webapi_platform_error' && (err.data?.error === 'not_in_channel' || err.data?.error === 'channel_not_found')) {
        try {
          await client.conversations.join({ channel: event.channel });
          await say(msg);
        } catch (joinErr) {
          console.error('Failed to auto-join channel for help message:', joinErr);
        }
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error('Error in handleIncomingMessage:', err);
  }
};

export const registerMentions = (app) => {
  app.event('app_mention', async (args) => {
    await handleIncomingMessage(args);
  });

  app.event('message', async (args) => {
    const { event } = args;
    if (event.channel_type === 'im' && !event.bot_id) {
      await handleIncomingMessage(args);
    }
  });
};
