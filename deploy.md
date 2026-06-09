# Deploying ZeroX

This guide explains how to deploy your own instance of ZeroX to a Linux server or a platform like [Hack Club Nest](https://nest.hackclub.com).

## Prerequisites

* A Linux server or Nest account
* Node.js v24.11.1
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

## 5. Run as a systemd service

Without systemd, your bot will stop when you disconnect SSH, when the server restarts, or when the process crashes. Systemd keeps it alive.

Copy the service file to the systemd directory:
```bash
cp slackbot.service /etc/systemd/system/slackbot.service
```

Make sure the paths in `/etc/systemd/system/slackbot.service` match your repository location:
```ini
[Unit]
Description=ZeroX Slack Assistant
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
Restart=always
WorkingDirectory=/root/ZeroX-SlackBot
ExecStart=/usr/bin/node index.js
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
systemctl daemon-reload
systemctl enable --now slackbot.service
```

### Useful Commands

| Action | Command |
|---|---|
| Start | `systemctl start slackbot` |
| Stop | `systemctl stop slackbot` |
| Restart | `systemctl restart slackbot` |
| View logs | `journalctl -u slackbot -f` |

## 6. Alternativerly Run with PM2
Without PM2, your bot will stop when you disconnect SSH or if it crashes. PM2 keeps it alive.

Install PM2 globally:
```bash
npm install -g pm2
```

Start the bot with PM2:
```bash
pm2 start index.js --name slackbot
```

Save the process list and enable auto-start on reboot:
```bash
pm2 save
pm2 startup
```

> Run the command that `pm2 startup` outputs to register the startup hook.

### Useful Commands

| Action | Command |
|---|---|
| Start | `pm2 start slackbot` |
| Stop | `pm2 stop slackbot` |
| Restart | `pm2 restart slackbot` |
| View logs | `pm2 logs slackbot` |
