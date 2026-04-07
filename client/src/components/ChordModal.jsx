import ChordDiagram from './ChordDiagram';

const ChordModal = ({ chord, open, onClose }) => {
  if (!chord || !open) return null;

  const fretsDisplay = chord.frets.map(f => (f === -1 ? 'X' : f)).join(' \u2013 ');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="glass border-border sm:max-w-md rounded-lg p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-foreground mb-4">{chord.name}</h2>
        <div className="flex flex-col items-center gap-4 py-4">
          <ChordDiagram chord={chord} size="lg" />
          <div className="w-full space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="text-foreground font-medium">{chord.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="text-foreground font-medium">{chord.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Difficulty</span>
              <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                chord.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                chord.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>{chord.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frets</span>
              <span className="text-foreground font-mono text-xs">{fretsDisplay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fingers</span>
              <span className="text-foreground font-mono text-xs">{chord.fingers.map(f => (f === 0 ? '\u2013' : f)).join(' \u2013 ')}</span>
            </div>
            <div className="pt-2 border-t border-border text-xs text-muted-foreground space-y-1">
              <p><span className="font-semibold text-foreground">Numbers</span> = fret to press on that string</p>
              <p><span className="font-semibold text-foreground">0</span> = play the string open (no fret pressed)</p>
              <p><span className="font-semibold text-foreground">X</span> = mute / don&apos;t play that string</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-secondary rounded-md text-sm text-foreground w-full">Close</button>
      </div>
    </div>
  );
};

export default ChordModal;
