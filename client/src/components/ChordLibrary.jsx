import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import ChordCard from './ChordCard';
import ChordModal from './ChordModal';
import SearchBar from './SearchBar';
import { HelpCircle } from 'lucide-react';

const ChordLibrary = () => {
  const { chords } = useData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedChord, setSelectedChord] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  const filtered = chords.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.difficulty === filter || c.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Chord Library</h1>
        <button
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 border border-primary/30 hover:border-primary/50 rounded-md transition"
        >
          <HelpCircle className="h-4 w-4" />
          Finger Guide
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search chords..." /></div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="all">All</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="Open">Open</option>
          <option value="Barre">Barre</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filtered.map(c => <ChordCard key={c.id} chord={c} onClick={() => setSelectedChord(c)} />)}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No chords found</p>}

      <ChordModal chord={selectedChord} open={!!selectedChord} onClose={() => setSelectedChord(null)} />

      {/* Finger Guide Modal - replace with your own modal implementation */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowGuide(false)}>
          <div className="glass border-border sm:max-w-sm rounded-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-foreground mb-4">Finger Guide</h2>
            <div className="w-full space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">T</span><span className="text-foreground font-medium">Thumb</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">1</span><span className="text-foreground font-medium">Index finger</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">2</span><span className="text-foreground font-medium">Middle finger</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">3</span><span className="text-foreground font-medium">Ring finger</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">4</span><span className="text-foreground font-medium">Pinky finger</span></div>
            </div>
            <button onClick={() => setShowGuide(false)} className="mt-4 px-4 py-2 bg-secondary rounded-md text-sm text-foreground">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChordLibrary;
