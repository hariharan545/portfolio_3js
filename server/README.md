# Contact API

Visitors fill the contact form, this server saves the message in **MongoDB Atlas** and **emails it to you**.

```
browser form  ->  POST /api/contact  ->  validate  ->  Atlas (collection "contacts")  +  email to you
```

## Run it

```bash
npm run server      # API only, http://localhost:8787
npm run dev:all     # website (5173) and API together
```

In dev the website proxies `/api` to the API, so no extra setup is needed. `GET /api/health` shows what is configured.

## 1. MongoDB Atlas

1. Atlas > **Database Access**: create a user with a password (read and write on one database is enough).
2. Atlas > **Network Access**: allow your IP. For a hosted API, allow its IP (or `0.0.0.0/0` if the host has no fixed IP).
3. Atlas > **Connect > Drivers**: copy the connection string, replace `<password>` with the user's password.
4. Put it in `server/.env` as `MONGODB_URI=...`. If the password has special characters (`@ : / ?`), URL-encode them.

Messages are stored in database `portfolio`, collection `contacts` (change with `MONGODB_DB` and `MONGODB_COLLECTION`).

## 2. Email

Any SMTP account works. For Gmail:

1. Turn on 2-step verification, then create an **App Password** (Google Account > Security > App passwords).
2. In `server/.env`: `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`, `SMTP_USER=you@gmail.com`,
   `SMTP_PASS=<the 16-character app password>`, `MAIL_TO=you@gmail.com`.

Each email has the visitor as **Reply-To**, so pressing Reply answers them directly.
Without SMTP settings, dev mode only prints the email in the API console.

## 3. Secrets

`server/.env` is git-ignored. Never commit it, never paste it into the website code. If a password leaks, rotate it in Atlas or Google.

## Protection built in

- Origin check: only `ALLOWED_ORIGIN` sites may call the API from a browser
- Rate limit: 5 messages per IP per 15 minutes
- Hidden honeypot field to drop bots, 10 KB body limit, input length checks
- HTML in messages is escaped in the email

## Going live

Deploy `server/` to any Node host (Render, Railway, a VPS), set the same variables there plus `NODE_ENV=production`,
`ALLOWED_ORIGIN=https://your-site`, and `TRUST_PROXY=1`. Build the website with `VITE_API_URL=https://your-api-host`.
