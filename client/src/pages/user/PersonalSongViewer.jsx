import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import LyricsViewer from '../../components/LyricsViewer';
import FavoriteButton from '../../components/FavoriteButton';
import ChordDiagram from '../../components/ChordDiagram';
import PersonalSongEditor from '../../components/PersonalSongEditor';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

const PersonalSongViewer = () => {
  const { id } = useParams();
  const { personalSongs, chords, toggleFavorite, deletePersonalSong } = useData();
  const navigate = useNavigate();
  const song = personalSongs.find(s => s.id === id);
  const [editing, setEditing] = useState(false);

  if (!song) return <div className="text-center py-12 text-muted-foreground">Song not found</div>;

  const chordNames = typeof song.chords === 'string' ? song.chords.split(',').map(c => c.trim()) : (song.chords || []);
  const songChords = chords.filter(c => chordNames.includes(c.name));

  const handleDelete = () => {
    if (confirm('Delete this song?')) {
      deletePersonalSong(song.id);
      navigate('/my-songs');
    }
  };

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setEditing(false)} className="p-2 rounded-md hover:bg-secondary transition"><ArrowLeft className="h-5 w-5 text-muted-foreground" /></button>
          <h1 className="text-2xl font-bold text-foreground">Edit Song</h1>
        </div>
        <PersonalSongEditor existingSong={song} onClose={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/my-songs')} className="p-2 rounded-md hover:bg-secondary transition"><ArrowLeft className="h-5 w-5 text-muted-foreground" /></button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{song.title}</h1>
          <p className="text-muted-foreground">{song.artist}</p>
        </div>
        <FavoriteButton isFavorite={!!song.is_favorite} onClick={() => toggleFavorite(song.id)} />
        <button onClick={() => setEditing(true)} className="p-2 rounded-md hover:bg-secondary transition">
          <Edit className="h-4 w-4 text-muted-foreground" />
        </button>
        <button onClick={handleDelete} className="p-2 rounded-md hover:bg-destructive/20 transition">
          <Trash2 className="h-4 w-4 text-destructive" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-xs px-3 py-1 rounded-full gradient-amber text-primary-foreground font-medium">Key: {song.key}</span>
        <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">Capo: {song.capo}</span>
        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">Personal</span>
      </div>
      {songChords.length > 0 && (
        <div className="glass rounded-lg p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Chords Used</h4>
          <div className="flex flex-wrap gap-3">
            {songChords.map(c => (
              <div key={c.id} className="flex flex-col items-center">
                <ChordDiagram chord={c} size="sm" />
                <span className="text-xs text-foreground mt-1">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <LyricsViewer lyrics={song.lyrics} />
    </div>
  );
};

export default PersonalSongViewer;
