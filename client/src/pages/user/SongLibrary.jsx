import { useState } from 'react';
import SongCard from '../../components/SongCard';
import SearchBar from '../../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext'; // ✅ FIX: import your hook

const SongLibrary = () => {
  const { songs = [], toggleFavorite } = useData(); // ✅ safety fallback
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filtered = songs.filter(s => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === 'all' || (filter === 'favorites' && s.is_favorite); //new

    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Song Library</h1>
          <p className="text-sm text-muted-foreground">
            Browse songs managed by admin
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search songs..."
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-md text-sm transition ${
              filter === 'all'
                ? 'gradient-amber text-primary-foreground'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter('favorites')}
            className={`px-3 py-2 rounded-md text-sm transition ${
              filter === 'favorites'
                ? 'gradient-amber text-primary-foreground'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(s => (
          <SongCard
            key={s.id}
            song={s}
            onClick={() => navigate(`/songs/${s.id}`)}
            onToggleFavorite={() => toggleFavorite(s.id, 'global')} //new
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No songs found
        </p>
      )}
    </div>
  );
};

export default SongLibrary;