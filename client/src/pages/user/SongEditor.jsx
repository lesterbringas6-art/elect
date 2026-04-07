import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import LyricsEditor from '../../components/LyricsEditor';
import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

const SongEditor = () => {
  const { id } = useParams();
  const { songs, updateSong } = useData();
  const navigate = useNavigate();
  const song = songs.find(s => s.id === id);

  const [title, setTitle] = useState(song?.title || '');
  const [artist, setArtist] = useState(song?.artist || '');
  const [lyrics, setLyrics] = useState(song?.lyrics || '');
  const [key, setKey] = useState(song?.key || 'C');
  const [capo, setCapo] = useState(song?.capo || 0);

  if (!song) return <div className="text-center py-12 text-muted-foreground">Song not found</div>;

  const handleSave = () => {
    const chordRegex = /\[([A-G][#b]?[a-z0-9]*)\]/g;
    const foundChords = [];
    let match;
    while ((match = chordRegex.exec(lyrics)) !== null) foundChords.push(match[1]);
    updateSong(song.id, { title, artist, lyrics, key, capo, chords: foundChords.join(', ') });
    navigate(`/songs/${song.id}`);
  };

  const inputClass = "w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-secondary transition"><ArrowLeft className="h-5 w-5 text-muted-foreground" /></button>
        <h1 className="text-2xl font-bold text-foreground">Edit Song</h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-foreground">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} /></div>
        <div><label className="block text-sm font-medium mb-1 text-foreground">Artist</label><input value={artist} onChange={e => setArtist(e.target.value)} className={inputClass} /></div>
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
      <LyricsEditor value={lyrics} onChange={setLyrics} />
      <button onClick={handleSave} className="px-4 py-2 gradient-amber rounded-md font-medium text-primary-foreground text-sm hover:opacity-90 transition flex items-center gap-2">
        <Save className="h-4 w-4" /> Save Changes
      </button>
    </div>
  );
};

export default SongEditor;
