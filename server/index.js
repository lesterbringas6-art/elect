import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { query } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean); // Filters out undefined if FRONTEND_URL isn't set yet

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ========================
// AUTH ROUTES
// ========================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if email exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const ADMIN_SECRET = 'ELECTRUM_ADMIN_2024';
    const role = adminCode === ADMIN_SECRET ? 'admin' : 'user';
    if (adminCode && adminCode !== ADMIN_SECRET) {
      return res.status(400).json({ error: 'Invalid admin code' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, hashedPassword, role]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================
// CHORDS ROUTES
// ========================

app.get('/api/chords', async (req, res) => {
  try {
    const result = await query('SELECT * FROM chords ORDER BY difficulty, name');
    res.json(result.rows);
  } catch (error) {
    console.error('Get chords error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/chords', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, type, frets, fingers, difficulty, category } = req.body;

    if (!name || !type || !frets || !fingers || !difficulty || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(
      'INSERT INTO chords (name, type, frets, fingers, difficulty, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, type, frets, fingers, difficulty, category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create chord error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/chords/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, type, frets, fingers, difficulty, category } = req.body;

    const result = await query(
      'UPDATE chords SET name = $1, type = $2, frets = $3, fingers = $4, difficulty = $5, category = $6 WHERE id = $7 RETURNING *',
      [name, type, frets, fingers, difficulty, category, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chord not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update chord error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/chords/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await query('DELETE FROM chords WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chord not found' });
    }

    res.json({ message: 'Chord deleted' });
  } catch (error) {
    console.error('Delete chord error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================
// SONGS ROUTES (Global Library)
// ========================

app.get('/api/songs', authenticateToken, async (req, res) => { //new
  try {
    const userId = req.user.id;
    const result = await query(`
      SELECT s.*, 
      CASE WHEN f.id IS NOT NULL THEN TRUE ELSE FALSE END as is_favorite
      FROM songs s
      LEFT JOIN favorites f ON s.id = f.song_id AND f.user_id = $1
      ORDER BY s.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/songs/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM songs WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get song error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/songs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, artist, lyrics, chords, key, capo } = req.body;

    if (!title || !artist || !lyrics || !key) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(
      'INSERT INTO songs (title, artist, lyrics, chords, key, capo, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, artist, lyrics, chords || [], key, capo || 0, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create song error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/songs/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, artist, lyrics, chords, key, capo } = req.body;

    const result = await query(
      'UPDATE songs SET title = $1, artist = $2, lyrics = $3, chords = $4, key = $5, capo = $6 WHERE id = $7 RETURNING *',
      [title, artist, lyrics, chords || [], key, capo || 0, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update song error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/songs/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await query('DELETE FROM songs WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json({ message: 'Song deleted' });
  } catch (error) {
    console.error('Delete song error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================
// PERSONAL SONGS ROUTES
// ========================

app.get('/api/personal-songs', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM personal_songs WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get personal songs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/personal-songs/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM personal_songs WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Personal song not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get personal song error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/personal-songs', authenticateToken, async (req, res) => {
  try {
    const { title, artist, lyrics, chords, key, capo } = req.body;

    if (!title || !artist || !lyrics || !key) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(
      'INSERT INTO personal_songs (title, artist, lyrics, chords, key, capo, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, artist, lyrics, chords || [], key, capo || 0, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create personal song error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/personal-songs/:id', authenticateToken, async (req, res) => {
  try {
    const { title, artist, lyrics, chords, key, capo } = req.body;

    const result = await query(
      'UPDATE personal_songs SET title = $1, artist = $2, lyrics = $3, chords = $4, key = $5, capo = $6 WHERE id = $7 AND user_id = $8 RETURNING *',
      [title, artist, lyrics, chords || [], key, capo || 0, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Personal song not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update personal song error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/personal-songs/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM personal_songs WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Personal song not found' });
    }

    res.json({ message: 'Personal song deleted' });
  } catch (error) {
    console.error('Delete personal song error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================
// FAVORITES ROUTES
// ========================

app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const { songId, songType } = req.body;

    if (!songId || !songType) {
      return res.status(400).json({ error: 'songId and songType are required' });
    }

    // Check if already favorited
    const existing = await query(
      'SELECT id FROM favorites WHERE user_id = $1 AND song_id = $2',
      [req.user.id, songId]
    );

    if (existing.rows.length > 0) {
      // Delete favorite
      await query(
        'DELETE FROM favorites WHERE user_id = $1 AND song_id = $2',
        [req.user.id, songId]
      );
      return res.json({ message: 'Favorite removed' });
    }

    // Add favorite
    const result = await query(
      'INSERT INTO favorites (user_id, song_id, song_type) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, songId, songType]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/favorites/:songId', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM favorites WHERE user_id = $1 AND song_id = $2 RETURNING id',
      [req.user.id, req.params.songId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Favorite deleted' });
  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================
// USERS ROUTES (Admin)
// ========================

app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================
// HEALTH CHECK
// ========================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ========================
// START SERVER
// ========================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
