import { useState } from 'react';

const ChordForm = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || 'Major');
  const [frets, setFrets] = useState(initialData?.frets.join(',') || '0,0,0,0,0,0');
  const [fingers, setFingers] = useState(initialData?.fingers.join(',') || '0,0,0,0,0,0');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'beginner');
  const [category, setCategory] = useState(initialData?.category || 'Open');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name, type,
      frets: frets.split(',').map(Number),
      fingers: fingers.split(',').map(Number),
      difficulty, category,
    });
  };

  const inputClass = "w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required className={inputClass} placeholder="e.g. Am" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className={inputClass}>
            {['Major', 'Minor', '7th', 'maj7', 'min7', 'sus2', 'sus4', 'dim', 'aug'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Frets (comma-separated, -1 for muted)</label>
        <input value={frets} onChange={e => setFrets(e.target.value)} className={inputClass} placeholder="0,0,2,2,1,0" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Fingers (comma-separated)</label>
        <input value={fingers} onChange={e => setFingers(e.target.value)} className={inputClass} placeholder="0,0,2,3,1,0" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Difficulty</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className={inputClass}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Category</label>
          <input value={category} onChange={e => setCategory(e.target.value)} className={inputClass} placeholder="Open / Barre" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="px-4 py-2 gradient-amber rounded-md font-medium text-primary-foreground text-sm hover:opacity-90 transition">
          {initialData ? 'Update' : 'Create'} Chord
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-secondary rounded-md text-sm text-muted-foreground hover:text-foreground transition">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ChordForm;
