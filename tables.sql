-- =============================================
-- ELECTRUM DATABASE SCHEMA
-- Run: psql -U postgres -d electrum_db -f electrum_tables.sql
-- =============================================

-- Create database (run separately if needed)
-- CREATE DATABASE electrum_db;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- CHORDS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS chords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  frets INTEGER[] NOT NULL,
  fingers INTEGER[] NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category VARCHAR(50) NOT NULL
);

-- =============================================
-- SONGS TABLE (Admin Global Library)
-- =============================================
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  lyrics TEXT NOT NULL,
  chords TEXT[] NOT NULL,
  key VARCHAR(10) NOT NULL,
  capo INTEGER NOT NULL DEFAULT 0,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- PERSONAL SONGS TABLE (User Workspace)
-- =============================================
CREATE TABLE IF NOT EXISTS personal_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  lyrics TEXT NOT NULL,
  chords TEXT[] NOT NULL,
  key VARCHAR(10) NOT NULL,
  capo INTEGER NOT NULL DEFAULT 0,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- FAVORITES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  song_id UUID NOT NULL,
  song_type VARCHAR(20) NOT NULL DEFAULT 'global' CHECK (song_type IN ('global', 'personal')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, song_id)
);

-- =============================================
-- SEED: DEFAULT CHORDS
-- =============================================

-- Beginner (Open Chords)
INSERT INTO chords (name, type, frets, fingers, difficulty, category) VALUES
  ('C',    'Major', '{0,3,2,0,1,0}',    '{0,3,2,0,1,0}',    'beginner', 'Open'),
  ('G',    'Major', '{3,2,0,0,0,3}',    '{2,1,0,0,0,3}',    'beginner', 'Open'),
  ('D',    'Major', '{-1,-1,0,2,3,2}',  '{0,0,0,1,3,2}',    'beginner', 'Open'),
  ('Am',   'Minor', '{0,0,2,2,1,0}',    '{0,0,2,3,1,0}',    'beginner', 'Open'),
  ('Em',   'Minor', '{0,2,2,0,0,0}',    '{0,2,3,0,0,0}',    'beginner', 'Open'),
  ('E',    'Major', '{0,2,2,1,0,0}',    '{0,2,3,1,0,0}',    'beginner', 'Open'),
  ('A',    'Major', '{0,0,2,2,2,0}',    '{0,0,1,2,3,0}',    'beginner', 'Open'),
  ('Dm',   'Minor', '{-1,-1,0,2,3,1}',  '{0,0,0,2,3,1}',    'beginner', 'Open');

-- Intermediate
INSERT INTO chords (name, type, frets, fingers, difficulty, category) VALUES
  ('F',     'Major', '{1,1,2,3,3,1}',    '{1,1,2,3,4,1}',    'intermediate', 'Barre'),
  ('Bm',    'Minor', '{-1,2,4,4,3,2}',   '{0,1,3,4,2,1}',    'intermediate', 'Barre'),
  ('B',     'Major', '{-1,2,4,4,4,2}',   '{0,1,2,3,4,1}',    'intermediate', 'Barre'),
  ('F#m',   'Minor', '{2,4,4,2,2,2}',    '{1,3,4,1,1,1}',    'intermediate', 'Barre'),
  ('G5',    'Power', '{3,5,5,-1,-1,-1}',  '{1,3,4,0,0,0}',    'intermediate', 'Power'),
  ('A5',    'Power', '{5,7,7,-1,-1,-1}',  '{1,3,4,0,0,0}',    'intermediate', 'Power'),
  ('Dsus4', 'sus4',  '{-1,-1,0,2,3,3}',  '{0,0,0,1,2,3}',    'intermediate', 'Open'),
  ('Asus2', 'sus2',  '{-1,0,2,2,0,0}',   '{0,0,2,3,0,0}',    'intermediate', 'Open');

-- Advanced
INSERT INTO chords (name, type, frets, fingers, difficulty, category) VALUES
  ('Cmaj7',  'maj7',  '{-1,3,2,0,0,0}',   '{0,3,2,0,0,0}',   'advanced', 'Open'),
  ('G7',     '7th',   '{3,2,0,0,0,1}',    '{3,2,0,0,0,1}',   'advanced', 'Open'),
  ('Am7',    'min7',  '{-1,0,2,0,1,0}',   '{0,0,2,0,1,0}',   'advanced', 'Open'),
  ('Bm7b5',  'dim',   '{-1,2,3,2,3,-1}',  '{0,1,3,2,4,0}',   'advanced', 'Jazz'),
  ('C9',     '9th',   '{-1,3,2,3,3,-1}',  '{0,2,1,3,4,0}',   'advanced', 'Jazz'),
  ('Fmaj7',  'maj7',  '{-1,8,10,9,10,8}', '{0,1,3,2,4,1}',   'advanced', 'Barre'),
  ('Bb13',   '13th',  '{6,-1,6,7,8,-1}',  '{1,0,2,3,4,0}',   'advanced', 'Jazz');

-- Expert (stored as 'advanced' difficulty)
INSERT INTO chords (name, type, frets, fingers, difficulty, category) VALUES
  ('D/F#',   'Major', '{2,-1,0,2,3,2}',   '{1,0,0,2,4,3}',   'advanced', 'Slash'),
  ('E7#9',   '7th',   '{-1,7,6,7,8,-1}',  '{0,2,1,3,4,0}',   'advanced', 'Jazz'),
  ('G13b9',  '13th',  '{3,-1,3,4,4,4}',   '{1,0,2,3,3,3}',   'advanced', 'Jazz'),
  ('F#m11',  'min7',  '{2,4,2,2,5,2}',    '{1,3,1,1,4,1}',   'advanced', 'Jazz'),
  ('Amaj9',  'maj7',  '{5,-1,6,6,0,-1}',  '{1,0,3,4,0,0}',   'advanced', 'Jazz'),
  ('Cdim7',  'dim',   '{-1,3,4,2,4,-1}',  '{0,2,3,1,4,0}',   'advanced', 'Jazz');

-- =============================================
-- SEED: SAMPLE SONGS
-- =============================================
INSERT INTO songs (title, artist, lyrics, chords, key, capo) VALUES
  (
    'Wonderwall', 'Oasis',
    E'[Em]Today is gonna be the day\nThat they''re gonna throw it back to [G]you\n[D]By now you should''ve somehow\nRealized what you gotta [A]do',
    '{Em,G,D,A}', 'Em', 2
  ),
  (
    'Hotel California', 'Eagles',
    E'[Am]On a dark desert highway\n[E]Cool wind in my hair\n[G]Warm smell of colitas\n[D]Rising up through the air',
    '{Am,E,G,D}', 'Am', 0
  );

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_songs_user_id ON songs(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_songs_user_id ON personal_songs(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_chords_difficulty ON chords(difficulty);
