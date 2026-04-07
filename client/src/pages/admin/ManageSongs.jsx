import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Trash2, Music, Plus, Edit, X } from 'lucide-react';

const emptySongForm = { title: '', artist: '', lyrics: '', chords: '', key: 'C', capo: 0 };

const ManageSongs = () => {
  const { songs, addSong, updateSong, deleteSong } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [form, setForm] = useState(emptySongForm);

  const openAdd = () => { setEditingSong(null); setForm(emptySongForm); setShowForm(true); };
  const openEdit = (s) => { setEditingSong(s); setForm({ title: s.title, artist: s.artist, lyrics: s.lyrics, chords: typeof s.chords === 'string' ? s.chords : s.chords?.join(', ') || '', key: s.key, capo: s.capo }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingSong(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const chordArr = form.chords.split(',').map(c => c.trim()).filter(Boolean);
    if (editingSong) {
      updateSong(editingSong.id, { title: form.title, artist: form.artist, lyrics: form.lyrics, chords: chordArr, key: form.key, capo: form.capo });
    } else {
      addSong({ title: form.title, artist: form.artist, lyrics: form.lyrics, chords: chordArr, key: form.key, capo: form.capo, userId: 'admin' });
    }
    closeForm();
  };

  const inputClass = "w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Manage Songs</h1>
        <button onClick={openAdd} className="px-4 py-2 gradient-amber rounded-md font-medium text-primary-foreground text-sm hover:opacity-90 transition flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Song
        </button>
      </div>
      {showForm && (
        <div className="glass rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{editingSong ? 'Edit' : 'Add'} Song</h3>
            <button onClick={closeForm} className="p-1 hover:bg-secondary rounded-md transition"><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1 text-foreground">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className={inputClass} placeholder="Song title" /></div>
              <div><label className="block text-sm font-medium mb-1 text-foreground">Artist</label>
                <input value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} required className={inputClass} placeholder="Artist name" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1 text-foreground">Lyrics (use [Chord] inline)</label>
              <textarea value={form.lyrics} onChange={e => setForm({ ...form, lyrics: e.target.value })} rows={5} className={inputClass} placeholder="[Am]On a dark desert highway..." /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium mb-1 text-foreground">Chords (comma-separated)</label>
                <input value={form.chords} onChange={e => setForm({ ...form, chords: e.target.value })} className={inputClass} placeholder="Am, G, D" /></div>
              <div><label className="block text-sm font-medium mb-1 text-foreground">Key</label>
                <input value={form.key} onChange={e => setForm({ ...form, key: e.target.value })} className={inputClass} placeholder="C" /></div>
              <div><label className="block text-sm font-medium mb-1 text-foreground">Capo</label>
                <input type="number" value={form.capo} onChange={e => setForm({ ...form, capo: Number(e.target.value) })} min={0} max={12} className={inputClass} /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="px-4 py-2 gradient-amber rounded-md font-medium text-primary-foreground text-sm hover:opacity-90 transition">{editingSong ? 'Update' : 'Create'} Song</button>
              <button type="button" onClick={closeForm} className="px-4 py-2 bg-secondary rounded-md text-sm text-muted-foreground hover:text-foreground transition">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="glass rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            <th className="text-left p-3 text-muted-foreground font-medium">Title</th>
            <th className="text-left p-3 text-muted-foreground font-medium">Artist</th>
            <th className="text-left p-3 text-muted-foreground font-medium">Key</th>
            <th className="text-left p-3 text-muted-foreground font-medium">Chords</th>
            <th className="text-right p-3 text-muted-foreground font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {songs.map(s => (
              <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/50 transition">
                <td className="p-3 font-semibold text-foreground flex items-center gap-2"><Music className="h-4 w-4 text-primary" />{s.title}</td>
                <td className="p-3 text-muted-foreground">{s.artist}</td>
                <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{s.key}</span></td>
                <td className="p-3 text-muted-foreground text-xs">{s.chords.join(', ')}</td>
                <td className="p-3 text-right">
                  <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-secondary rounded-md transition mr-1"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                  <button onClick={() => deleteSong(s.id)} className="p-1.5 hover:bg-destructive/10 rounded-md transition"><Trash2 className="h-4 w-4 text-destructive" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {songs.length === 0 && <p className="text-center text-muted-foreground py-8">No songs</p>}
      </div>
    </div>
  );
};

export default ManageSongs;
