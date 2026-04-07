import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import SongCard from '../../components/SongCard';
import SearchBar from '../../components/SearchBar';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PersonalSongEditor from '../../components/PersonalSongEditor';

const MySongs = () => {
  const { personalSongs, toggleFavorite } = useData();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const navigate = useNavigate();

  const mySongs = personalSongs;
  const filtered = mySongs.filter(s =>
    (s.title?.toLowerCase() || '').includes(search.toLowerCase()) || (s.artist?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Songs</h1>
          <p className="text-sm text-muted-foreground">Create your own songs with chord annotations</p>
        </div>
        <button onClick={() => setShowEditor(true)} className="px-4 py-2 gradient-amber rounded-md font-medium text-primary-foreground text-sm hover:opacity-90 transition flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Song
        </button>
      </div>
      {showEditor && <PersonalSongEditor onClose={() => setShowEditor(false)} />}
      <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search your songs..." /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(s => (
          <SongCard key={s.id} song={s} onClick={() => navigate(`/my-songs/${s.id}`)} onToggleFavorite={() => toggleFavorite(s.id)} />
        ))}
      </div>
      {filtered.length === 0 && !showEditor && (
        <p className="text-center text-muted-foreground py-8">
          {mySongs.length === 0 ? 'No songs yet. Create your first song!' : 'No songs match your search'}
        </p>
      )}
    </div>
  );
};

export default MySongs;
