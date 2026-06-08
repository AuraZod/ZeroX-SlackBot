import './src/config.js';
import { app } from './src/app.js';
import { loadCommands } from './src/loader.js';
import { registerMentions } from './src/mentions.js';
import { initDb } from './db.js';

const start = async () => {
  try {
    await initDb();
    await loadCommands(app);
    registerMentions(app);

    await app.start();
    console.log('zerox is up and running');
  } catch (err) {
    console.error('failed to start zerox, Error Occured :', err);
    process.exit(1);
  }
};

start();
