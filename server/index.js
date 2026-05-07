import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// ESM equivalents of __dirname/__filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cortex';
const isProd = process.env.NODE_ENV === 'production';

// In production the SPA is served from the same origin, so CORS isn't needed.
// In dev, allow the Vite dev server.
app.use(
  cors({
    origin: isProd ? false : 'http://localhost:5194',
    credentials: true,
  })
);
app.use(express.json({ limit: '64kb' }));

const waitlistSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    role: { type: String, enum: ['engineer', 'founder', 'research', 'product', 'other'], default: 'engineer' },
    source: { type: String, default: 'web' },
  },
  { timestamps: true }
);

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

const memoryStore = new Set();
let mongoConnected = false;

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    mongoConnected = true;
    console.log('[cortex-api] mongo connected');
  })
  .catch((err) => {
    console.warn('[cortex-api] mongo not reachable — falling back to in-memory store:', err.message);
  });

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mongo: mongoConnected, ts: Date.now() });
});

app.post('/api/waitlist', async (req, res) => {
  const { email, role } = req.body ?? {};
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  const cleanEmail = email.toLowerCase().trim();
  const cleanRole = ['engineer', 'founder', 'research', 'product', 'other'].includes(role) ? role : 'engineer';

  try {
    if (mongoConnected) {
      await Waitlist.create({ email: cleanEmail, role: cleanRole });
    } else {
      if (memoryStore.has(cleanEmail)) throw { code: 11000 };
      memoryStore.add(cleanEmail);
    }
    return res.status(201).json({ ok: true, message: 'You are on the list. We will reach out soon.' });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(200).json({ ok: true, message: 'You are already on the list — sit tight.' });
    }
    console.error('[cortex-api] waitlist error', err);
    return res.status(500).json({ error: 'Could not save your entry. Try again shortly.' });
  }
});

app.get('/api/stats', async (_req, res) => {
  try {
    const total = mongoConnected ? await Waitlist.countDocuments() : memoryStore.size;
    res.json({ total });
  } catch {
    res.json({ total: 0 });
  }
});

// In production, serve the built client and let any non-/api request fall
// through to index.html so the SPA can handle client-side routes.
if (isProd) {
  const clientDist = path.resolve(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => res.json({ message: 'cortex API running' }));
}

app.use((err, _req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`[cortex-api] listening on http://localhost:${PORT} (${isProd ? 'prod' : 'dev'})`);
});
