import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { createHash, timingSafeEqual } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';

const { PORT = 8080, CLIENT_ORIGIN = 'http://localhost:5173', PEPPER, MONGODB_URI } = process.env;
if (!PEPPER) { console.error('PEPPER is required. See .env.example'); process.exit(1); }
const HASHES = existsSync('hashes.json') ? JSON.parse(readFileSync('hashes.json', 'utf8')) : {};
if (!Object.keys(HASHES).length) console.warn('hashes.json missing. Run: PEPPER=... node ../scripts/make-hashes.mjs');

const Message = mongoose.model('Message', new mongoose.Schema({ name: String, email: String, subject: String, message: String }, { timestamps: true }));
if (MONGODB_URI) mongoose.connect(MONGODB_URI).then(() => console.log('mongo connected')).catch((e) => console.error('mongo error', e.message));

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f<>]/g, ' ').trim().slice(0, max);
const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN, methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '8kb' }));

const verifyLimit = rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: true, legacyHeaders: false });
const contactLimit = rateLimit({ windowMs: 60 * 60_000, limit: 5, standardHeaders: true, legacyHeaders: false });

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/verify', verifyLimit, (req, res) => {
  const id = clean(req.body?.id, 4), flag = clean(req.body?.flag, 200);
  const expected = HASHES[id];
  if (!expected) return res.status(400).json({ ok: false });
  const got = createHash('sha256').update(`${PEPPER}:${id}:${flag}`).digest();
  res.json({ ok: timingSafeEqual(got, Buffer.from(expected, 'hex')) });
});

app.post('/api/contact', contactLimit, async (req, res) => {
  const d = { name: clean(req.body?.name, 80), email: clean(req.body?.email, 120), subject: clean(req.body?.subject, 120), message: clean(req.body?.message, 2000) };
  if (d.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) || d.subject.length < 3 || d.message.length < 10) return res.status(400).json({ ok: false, error: 'invalid input' });
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ ok: false, error: 'storage unavailable' });
  await Message.create(d);
  res.status(201).json({ ok: true });
});

app.use((_req, res) => res.status(404).json({ ok: false }));
app.use((err, _req, res, _next) => { console.error(err.message); res.status(500).json({ ok: false }); });
app.listen(PORT, () => console.log(`api on :${PORT}`));
