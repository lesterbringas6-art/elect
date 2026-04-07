import { useParams, useNavigate } from 'react-router-dom';
import LyricsViewer from '../../components/LyricsViewer';
import FavoriteButton from '../../components/FavoriteButton';
import ChordDiagram from '../../components/ChordDiagram';
import { useData } from '../../contexts/DataContext'; // ✅ FIX: import your hook
import { ArrowLeft } from 'lucide-react';

const SongViewer = () => {
  const { id } = useParams();
  const { songs, chords, toggleFavorite } = useData();
  const navigate = useNavigate();
  const song = songs.find(s => s.id === id);

  if (!song) return <div className="text-center py-12 text-muted-foreground">Song not found</div>;

  const songChords = chords.filter(c => song.chords.includes(c.name));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/songs')} className="p-2 rounded-md hover:bg-secondary transition"><ArrowLeft className="h-5 w-5 text-muted-foreground" /></button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{song.title}</h1>
          <p className="text-muted-foreground">{song.artist}</p>
        </div>
        <FavoriteButton isFavorite={!!song.isFavorite} onClick={() => toggleFavorite(song.id)} />
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-xs px-3 py-1 rounded-full gradient-amber text-primary-foreground font-medium">Key: {song.key}</span>
        <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">Capo: {song.capo}</span>
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

export default SongViewer;
