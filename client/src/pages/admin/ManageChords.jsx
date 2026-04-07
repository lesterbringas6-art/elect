import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import ChordForm from '../../components/ChordForm';
import ChordDiagram from '../../components/ChordDiagram';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ManageChords = () => {
  const { chords, addChord, updateChord, deleteChord } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingChord, setEditingChord] = useState(null);
  
  // 1. Add the filter state
  const [filter, setFilter] = useState('all');

  // 2. Logic to filter the chords list
  const filteredChords = chords.filter(chord => {
    if (filter === 'all') return true;
    // Checks both difficulty and type against the filter value
    return chord.difficulty === filter || chord.type === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Manage Chords</h1>
        
        <div className="flex items-center gap-3">
          {/* 3. The Filter Dropdown */}
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <button onClick={() => { setEditingChord(null); setShowForm(true); }}
            className="px-4 py-2 gradient-amber rounded-md font-medium text-primary-foreground text-sm hover:opacity-90 transition flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Chord
          </button>
        </div>
      </div>

      {(showForm || editingChord) && (
        <div className="glass rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">{editingChord ? 'Edit' : 'Create'} Chord</h3>
          <ChordForm initialData={editingChord || undefined}
            onSubmit={data => {
              if (editingChord) updateChord(editingChord.id, data);
              else addChord(data);
              setShowForm(false);
              setEditingChord(null);
            }}
            onCancel={() => { setShowForm(false); setEditingChord(null); }} />
        </div>
      )}

      <div className="glass rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-muted-foreground font-medium">Diagram</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Name</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Type</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Difficulty</th>
              <th className="text-right p-3 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* 4. Map over filteredChords instead of chords */}
            {filteredChords.map(c => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/50 transition">
                <td className="p-2"><ChordDiagram chord={c} size="sm" /></td>
                <td className="p-3 font-semibold text-foreground">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.type}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    c.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    c.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {c.difficulty}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditingChord(c)} className="p-1.5 hover:bg-secondary rounded-md transition mr-1">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => deleteChord(c.id)} className="p-1.5 hover:bg-destructive/10 rounded-md transition">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredChords.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-muted-foreground">
                  No chords found matching this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageChords;