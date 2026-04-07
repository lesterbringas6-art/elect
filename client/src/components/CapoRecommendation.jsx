const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const CapoRecommendation = ({ songKey, targetKey }) => {
  const getCapoPosition = (from, to) => {
    const fromIdx = NOTES.indexOf(from);
    const toIdx = NOTES.indexOf(to);
    if (fromIdx === -1 || toIdx === -1) return null;
    
    // Logic: (Target - Original + 12) % 12 finds the distance in semitones
    return (toIdx - fromIdx + 12) % 12;
  };

  const recommendations = NOTES.map(key => ({
    key,
    capo: getCapoPosition(key, songKey),
  })).filter(r => r.capo !== null && r.capo > 0 && r.capo <= 7);

  return (
    <div className="glass rounded-lg p-4">
      <h4 className="text-sm font-semibold text-foreground mb-3">
        Capo Recommendations for Key of {songKey}
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {recommendations.map(r => (
          <div 
            key={r.key} 
            className={`text-xs p-2 rounded-md border transition ${
              targetKey === r.key 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-border text-muted-foreground'
            }`}
          >
            Play as <span className="font-semibold text-foreground">{r.key}</span> → 
            Capo <span className="font-bold text-primary">{r.capo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapoRecommendation;