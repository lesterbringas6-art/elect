import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import LyricsEditor from './LyricsEditor';
import ChordDiagram from './ChordDiagram';
import { Upload, Music } from 'lucide-react';

const PersonalSongEditor = ({ onClose, existingSong }) => {
  const { addPersonalSong, updatePersonalSong, chords } = useData();
  const { user } = useAuth();
  const [title, setTitle] = useState(existingSong?.title || '');
  const [artist, setArtist] = useState(existingSong?.artist || user?.name || '');
  const [lyrics, setLyrics] = useState(existingSong?.lyrics || '');
  const [key, setKey] = useState(existingSong?.key || 'C');
  const [capo, setCapo] = useState(existingSong?.capo || 0);

  const extractChords = (text) => {
    const chordRegex = /\[([A-G][#b]?[a-z0-9]*)\]/g;
    const found = [];
    let match;
    while ((match = chordRegex.exec(text)) !== null) found.push(match[1]);
    return [...new Set(found)];
  };

  const detectedChords = extractChords(lyrics);
  const matchedChords = chords.filter(c => detectedChords.includes(c.name));

  const handleSubmit = (e) => {
    e.preventDefault();
    const songData = { title, artist, lyrics, chords: detectedChords, key, capo, userId: user.id };
    if (existingSong) {
      updatePersonalSong(existingSong.id, songData);
    } else {
      addPersonalSong(songData);
    }
    onClose();
  };

  const inputClass = "w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="glass rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
        <Music className="h-5 w-5 text-primary" />
        {existingSong ? 'Edit Your Song' : 'Create Your Song'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required className={inputClass} placeholder="Song title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Artist</label>
            <input value={artist} onChange={e => setArtist(e.target.value)} required className={inputClass} placeholder="Artist name" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Key</label>
            <select value={key} onChange={e => setKey(e.target.value)} className={inputClass}>
              {['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'].map(k => <option key={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Capo</label>
            <input type="number" min={0} max={12} value={capo} onChange={e => setCapo(Number(e.target.value))} className={inputClass} />
          </div>
        </div>

        <LyricsEditor value={lyrics} onChange={setLyrics} />

        {detectedChords.length > 0 && (
          <div className="glass rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Detected Chords</h4>
            <div className="flex flex-wrap gap-3">
              {detectedChords.map(name => {
                const chord = matchedChords.find(c => c.name === name);
                return (
                  <div key={name} className="flex flex-col items-center">
                    {chord ? (
                      <>
                        <ChordDiagram chord={chord} size="sm" />
                        <span className="text-xs text-primary mt-1 font-medium">{name}</span>
                      </>
                    ) : (
                      <div className="w-20 h-24 rounded-md border border-dashed border-border flex flex-col items-center justify-center">
                        <span className="text-xs text-primary font-medium">{name}</span>
                        <span className="text-[10px] text-muted-foreground">No diagram</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 gradient-amber rounded-md font-medium text-primary-foreground text-sm hover:opacity-90 transition flex items-center gap-2">
            <Upload className="h-4 w-4" /> {existingSong ? 'Update Song' : 'Save Song'}
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary rounded-md text-sm text-muted-foreground hover:text-foreground transition">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default PersonalSongEditor;
