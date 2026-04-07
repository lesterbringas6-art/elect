const LyricsEditor = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">Lyrics Editor</label>
      <p className="text-xs text-muted-foreground">Use [ChordName] to insert chords inline. e.g. [Am]Hello [G]world</p>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={12}
        className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        placeholder="[Am]Start typing lyrics with chords..." />
    </div>
  );
};

export default LyricsEditor;
