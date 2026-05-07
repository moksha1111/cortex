import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cortex';

app.use(cors());
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
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 })
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

app.listen(PORT, () => {
  console.log(`[cortex-api] listening on http://localhost:${PORT}`);
});
