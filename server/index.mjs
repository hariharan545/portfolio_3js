// Contact API: stores each message in MongoDB Atlas and emails it to you.
// Configure with server/.env (copy server/.env.example). Run with `npm run server`.
import express from 'express'
import rateLimit from 'express-rate-limit'
import nodemailer from 'nodemailer'
import { MongoClient } from 'mongodb'

const env = process.env
const PORT = Number(env.PORT ?? 8787)
const isProd = env.NODE_ENV === 'production'
const allowedOrigins = (env.ALLOWED_ORIGIN ?? 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

// ---------- storage (MongoDB Atlas) ----------
let collection = null
let dbStatus = env.MONGODB_URI ? 'connecting' : 'not configured'

async function connectDb() {
  if (!env.MONGODB_URI) {
    console.warn('[db] MONGODB_URI is not set: messages will not be stored.')
    return
  }
  try {
    const client = new MongoClient(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    await client.connect()
    collection = client.db(env.MONGODB_DB || 'portfolio').collection(env.MONGODB_COLLECTION || 'contacts')
    await collection.createIndex({ createdAt: -1 })
    dbStatus = 'connected'
    console.log('[db] connected to Atlas')
  } catch (err) {
    // never print the URI: it contains the password
    dbStatus = 'failed'
    console.error('[db] could not connect:', err instanceof Error ? err.message : 'unknown error')
  }
}

// ---------- email ----------
// Hosts such as Render's free plan block SMTP ports (465/587). An HTTPS email API (Resend) works everywhere.
const resendKey = env.RESEND_API_KEY

function makeTransport() {
  if (resendKey) return null // the API is used instead of SMTP
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT ?? 465),
      secure: (env.SMTP_SECURE ?? 'true') === 'true',
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  }
  if (!isProd) {
    console.warn('[mail] SMTP is not set: emails are only printed here (dev mode).')
    return nodemailer.createTransport({ jsonTransport: true })
  }
  console.warn('[mail] SMTP is not set: no email will be sent.')
  return null
}
const transport = makeTransport()
// in dev mode (no SMTP) a placeholder address lets the flow be tested end to end
const mailTo = env.MAIL_TO || env.SMTP_USER || (isProd ? undefined : 'dev@localhost')
// Resend's shared sender only delivers to the email you signed up with, which is exactly one inbox: yours
const mailFrom = env.MAIL_FROM || env.SMTP_USER || (resendKey ? 'Portfolio <onboarding@resend.dev>' : 'portfolio@localhost')
const canEmail = Boolean(mailTo && (resendKey || transport))

async function sendViaResend({ subject, text, html, replyTo }) {
  const res = await fetch(env.RESEND_API_URL || 'https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: mailFrom, to: [mailTo], subject, text, html, reply_to: replyTo }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Resend responded with HTTP ${res.status}`)
}

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// ---------- validation ----------
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// strip control characters (keeps normal newlines and tabs in the message)
// eslint-disable-next-line no-control-regex
const clean = (v) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim() : '')

function validate(body) {
  const name = clean(body?.name).replace(/\s+/g, ' ')
  const email = clean(body?.email)
  const message = clean(body?.message)
  const errors = {}
  if (name.length < 1 || name.length > 100) errors.name = 'Please enter your name (up to 100 characters).'
  if (!EMAIL.test(email) || email.length > 200) errors.email = 'Please enter a valid email address.'
  if (message.length < 5 || message.length > 3000) errors.message = 'Message must be between 5 and 3000 characters.'
  return { name, email, message, errors }
}

// ---------- app ----------
const app = express()
if (env.TRUST_PROXY) app.set('trust proxy', Number(env.TRUST_PROXY) || env.TRUST_PROXY)
app.disable('x-powered-by')

// only the portfolio's own origin(s) may call the API from a browser
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin) {
    if (!allowedOrigins.includes(origin)) return res.status(403).json({ ok: false, error: 'Origin not allowed.' })
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: dbStatus, mail: resendKey ? 'resend' : transport ? (env.SMTP_HOST ? 'smtp' : 'dev-only') : 'off' })
})

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many messages. Please try again in a few minutes.' },
})

app.post('/api/contact', limiter, async (req, res) => {
  // hidden "website" field: humans leave it empty, bots fill it. Pretend success and drop it.
  if (clean(req.body?.website)) return res.json({ ok: true })

  const { name, email, message, errors } = validate(req.body)
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors })

  if (!collection && !canEmail) {
    return res.status(503).json({ ok: false, error: 'The contact service is not set up yet. Please email me directly.' })
  }

  const doc = {
    name,
    email,
    message,
    ip: req.ip,
    userAgent: String(req.headers['user-agent'] ?? '').slice(0, 300),
    createdAt: new Date(),
    emailed: false,
  }

  let stored = false
  let insertedId = null
  if (collection) {
    try {
      insertedId = (await collection.insertOne(doc)).insertedId
      stored = true
    } catch (err) {
      console.error('[db] insert failed:', err instanceof Error ? err.message : 'unknown error')
    }
  }

  let emailed = false
  if (canEmail) {
    try {
      const subject = `Portfolio message from ${name}`.slice(0, 150)
      const text = `${message}\n\n-- \n${name} <${email}>`
      const html = `<p style="white-space:pre-wrap">${escapeHtml(message)}</p><hr><p><b>${escapeHtml(name)}</b> &lt;${escapeHtml(email)}&gt;</p>`
      if (resendKey) {
        await sendViaResend({ subject, text, html, replyTo: email })
      } else {
        const info = await transport.sendMail({
          from: mailFrom,
          to: mailTo,
          replyTo: { name: name.replace(/["<>]/g, ''), address: email },
          subject,
          text,
          html,
        })
        if (!env.SMTP_HOST) console.log('[mail] dev message:', info.message?.toString().slice(0, 400))
      }
      emailed = true
    } catch (err) {
      console.error('[mail] send failed:', err instanceof Error ? err.message : 'unknown error')
    }
  }

  if (stored && emailed && insertedId) {
    collection.updateOne({ _id: insertedId }, { $set: { emailed: true } }).catch(() => {})
  }

  if (!stored && !emailed) {
    return res.status(502).json({ ok: false, error: 'Could not deliver your message. Please email me directly.' })
  }
  res.json({ ok: true })
})

// anything thrown by the JSON parser etc.
app.use((err, _req, res, _next) => {
  const status = err?.status && err.status < 500 ? err.status : 500
  res.status(status).json({ ok: false, error: status === 413 ? 'Message is too large.' : 'Bad request.' })
})

await connectDb()
app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`))
