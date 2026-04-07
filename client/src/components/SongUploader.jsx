import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Upload } from 'lucide-react';

const SongUploader = ({ onClose }) => {
  const { addSong } = useData();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [key, setKey] = useState('C');
  const [capo, setCapo] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const chordRegex = /\[([A-G][#b]?[a-z0-9]*)\]/g;
    const foundChords = [];
    let match;
    while ((match = chordRegex.exec(lyrics)) !== null) foundChords.push(match[1]);
    addSong({ title, artist, lyrics, chords: [...new Set(foundChords)], key, capo, userId: user.id });
    onClose();
  };

  const inputClass = "w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="glass rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Add New Song</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1 text-foreground">Title</label><input value={title} onChange={e => setTitle(e.target.value)} required className={inputClass} /></div>
          <div><label className="block text-sm font-medium mb-1 text-foreground">Artist</label><input value={artist} onChange={e => setArtist(e.target.value)} required className={inputClass} /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Lyrics (use [Chord] notation)</label>
          <textarea value={lyrics} onChange={e => setLyrics(e.target.value)} rows={8} className={inputClass + ' font-mono'} placeholder="[Am]On a dark desert highway..." required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1 text-foreground">Key</label>
            <select value={key} onChange={e => setKey(e.target.value)} className={inputClass}>
              {['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'].map(k => <option key={k}>{k}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium mb-1 text-foreground">Capo</label>
            <input type="number" min={0} max={12} value={capo} onChange={e => setCapo(Number(e.target.value))} className={inputClass} />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 gradient-amber rounded-md font-medium text-primary-foreground text-sm hover:opacity-90 transition flex items-center gap-2">
            <Upload className="h-4 w-4" /> Save Song
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary rounded-md text-sm text-muted-foreground hover:text-foreground transition">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default SongUploader;
