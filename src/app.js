import pkg from '@slack/bolt';
const { App } = pkg;
import { config } from './config.js';

export const app = new App({
  token: config.slack.botToken,
  appToken: config.slack.appToken,
  socketMode: true,
});
