import { query } from './db.js';
import bcrypt from 'bcrypt';

const DEFAULT_CHORDS = [
  // Beginner
  { name: 'C', type: 'Major', frets: [0,3,2,0,1,0], fingers: [0,3,2,0,1,0], difficulty: 'beginner', category: 'Open' },
  { name: 'G', type: 'Major', frets: [3,2,0,0,0,3], fingers: [2,1,0,0,0,3], difficulty: 'beginner', category: 'Open' },
  { name: 'D', type: 'Major', frets: [-1,-1,0,2,3,2], fingers: [0,0,0,1,3,2], difficulty: 'beginner', category: 'Open' },
  { name: 'Am', type: 'Minor', frets: [0,0,2,2,1,0], fingers: [0,0,2,3,1,0], difficulty: 'beginner', category: 'Open' },
  { name: 'Em', type: 'Minor', frets: [0,2,2,0,0,0], fingers: [0,2,3,0,0,0], difficulty: 'beginner', category: 'Open' },
  { name: 'E', type: 'Major', frets: [0,2,2,1,0,0], fingers: [0,2,3,1,0,0], difficulty: 'beginner', category: 'Open' },
  { name: 'A', type: 'Major', frets: [0,0,2,2,2,0], fingers: [0,0,1,2,3,0], difficulty: 'beginner', category: 'Open' },
  { name: 'Dm', type: 'Minor', frets: [-1,-1,0,2,3,1], fingers: [0,0,0,2,3,1], difficulty: 'beginner', category: 'Open' },
  // Intermediate
  { name: 'F', type: 'Major', frets: [1,1,2,3,3,1], fingers: [1,1,2,3,4,1], difficulty: 'intermediate', category: 'Barre' },
  { name: 'Bm', type: 'Minor', frets: [-1,2,4,4,3,2], fingers: [0,1,3,4,2,1], difficulty: 'intermediate', category: 'Barre' },
  { name: 'B', type: 'Major', frets: [-1,2,4,4,4,2], fingers: [0,1,2,3,4,1], difficulty: 'intermediate', category: 'Barre' },
  { name: 'F#m', type: 'Minor', frets: [2,4,4,2,2,2], fingers: [1,3,4,1,1,1], difficulty: 'intermediate', category: 'Barre' },
  // Advanced
  { name: 'Cmaj7', type: 'maj7', frets: [-1,3,2,0,0,0], fingers: [0,3,2,0,0,0], difficulty: 'advanced', category: 'Open' },
  { name: 'G7', type: '7th', frets: [3,2,0,0,0,1], fingers: [3,2,0,0,0,1], difficulty: 'advanced', category: 'Open' },
];

const DEFAULT_SONGS = [
  {
    title: 'Wonderwall',
    artist: 'Oasis',
    lyrics: '[Em]Today is gonna be the day\nThat they\'re gonna throw it back to [G]you\n[D]By now you should\'ve somehow\nRealized what you gotta [A]do',
    chords: ['Em', 'G', 'D', 'A'],
    key: 'Em',
    capo: 2,
  },
  {
    title: 'Hotel California',
    artist: 'Eagles',
    lyrics: '[Am]On a dark desert highway\n[E]Cool wind in my hair\n[G]Warm smell of colitas\n[D]Rising up through the air',
    chords: ['Am', 'E', 'G', 'D'],
    key: 'Am',
    capo: 0,
  },
];

async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Check if admin user exists
    const adminCheck = await query('SELECT id FROM users WHERE email = $1', ['admin@electrum.app']);
    
    let adminId;
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminResult = await query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
        ['Admin', 'admin@electrum.app', hashedPassword, 'admin']
      );
      adminId = adminResult.rows[0].id;
      console.log('✓ Created admin user');
    } else {
      adminId = adminCheck.rows[0].id;
      console.log('✓ Admin user already exists');
    }

    // Seed chords
    const existingChords = await query('SELECT COUNT(*) FROM chords');
    if (existingChords.rows[0].count === 0) {
      for (const chord of DEFAULT_CHORDS) {
        await query(
          'INSERT INTO chords (name, type, frets, fingers, difficulty, category) VALUES ($1, $2, $3, $4, $5, $6)',
          [chord.name, chord.type, chord.frets, chord.fingers, chord.difficulty, chord.category]
        );
      }
      console.log(`✓ Seeded ${DEFAULT_CHORDS.length} chords`);
    } else {
      console.log('✓ Chords already exist');
    }

    // Seed songs
    const existingSongs = await query('SELECT COUNT(*) FROM songs');
    if (existingSongs.rows[0].count === 0) {
      for (const song of DEFAULT_SONGS) {
        await query(
          'INSERT INTO songs (title, artist, lyrics, chords, key, capo, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [song.title, song.artist, song.lyrics, song.chords, song.key, song.capo, adminId]
        );
      }
      console.log(`✓ Seeded ${DEFAULT_SONGS.length} songs`);
    } else {
      console.log('✓ Songs already exist');
    }

    console.log('✓ Database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
