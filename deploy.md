# Deploying ZeroX

This guide explains how to deploy your own instance of ZeroX to a Linux server or a platform like [Hack Club Nest](https://nest.hackclub.com).

## Prerequisites

* A Linux server or Nest account
* Node.js v18 or later
* A Slack workspace where you have permission to install apps

---

## 1. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and click **Create New App** > **From scratch**.
2. Give it a name and select your workspace.

### Enable Socket Mode
1. Navigate to **Socket Mode** in the left sidebar.
2. Toggle **Enable Socket Mode** on.
3. Give the app-level token a name and click **Generate**. Save the token that starts with `xapp-`.

### Add Bot Token Scopes
Go to **OAuth & Permissions** > **Bot Token Scopes** and add:
* `app_mentions:read`
* `chat:write`
* `channels:history`
* `commands`
* `im:history` (for DM support)

### Subscribe to Events
Go to **Event Subscriptions**, toggle **Enable Events** on, expand **Subscribe to bot events** and add:
* `app_mention`
* `message.im`

Click **Save Changes**.

### Register Slash Commands
Go to **Slash Commands** and create each of the following (the Request URL field is ignored in Socket Mode):
* `/zr-ping`
* `/zr-ask`
* `/zr-fact`
* `/zr-cat`
* `/zr-joke`
* `/zr-roast`
* `/zr-weather`
* `/zr-help`

### Install to Workspace
Go to **Install App** and click **Install to Workspace**. Copy the Bot Token that starts with `xbot-`.

---

## 2. Get API Keys

| Key | Where to get it |
|---|---|
| `SLACK_BOTTOKEN` | Slack app > Install App > Bot User OAuth Token |
| `SLACK_APPTOKEN` | Slack app > Basic Information > App-Level Tokens |
| `GEMINI_API` | [aistudio.google.com](https://aistudio.google.com) |
| `WEATHER_API` | [openweathermap.org/api](https://openweathermap.org/api) (free tier works) |
| `CAT_API` | [thecatapi.com](https://thecatapi.com) (free tier works) |

---

## 3. Clone and Configure

```bash
git clone https://github.com/AuraZod/ZeroX-SlackBot.git
cd slack-bot
npm install
cp .env.example .env
```

Open `.env` and fill in all the keys from step 2.

---

## 4. Test It

Run the bot directly to confirm everything connects:
```bash
node index.js
```

You should see `zerox is up and running` in the terminal. Press `Ctrl+C` to stop.

---

## 5. Run as a Background Service (Linux / Nest)

To keep the bot running after you log out, set it up as a systemd user service.

Copy the service file:
```bash
mkdir -p ~/.config/systemd/user/
cp slackbot.service ~/.config/systemd/user/slackbot.service
```

Edit the `WorkingDirectory` and `ExecStart` paths in the copied file to match where you cloned the repo:
```ini
[Service]
WorkingDirectory=/home/youruser/slack-bot
ExecStart=/usr/bin/env node index.js
```

Then enable and start it:
```bash
systemctl --user daemon-reload
systemctl --user enable slackbot
systemctl --user start slackbot
```

Allow the service to keep running when you are logged out:
```bash
loginctl enable-linger youruser
```

### Useful Commands

| Action | Command |
|---|---|
| Start | `systemctl --user start slackbot` |
| Stop | `systemctl --user stop slackbot` |
| Restart | `systemctl --user restart slackbot` |
| View logs | `journalctl --user -u slackbot -f` |
