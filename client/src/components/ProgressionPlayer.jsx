import { useState } from 'react';
import { Play, Pause, SkipBack } from 'lucide-react';

const ProgressionPlayer = ({ chords, bpm = 80 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);

  const play = () => {
    if (chords.length === 0) return;
    setIsPlaying(true);
    setCurrentIdx(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= chords.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentIdx(-1);
      } else {
        setCurrentIdx(i);
      }
    }, (60 / bpm) * 1000 * 2);
  };

  const reset = () => { setIsPlaying(false); setCurrentIdx(-1); };

  return (
    <div className="glass rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        <button onClick={reset} className="p-2 rounded-md hover:bg-secondary transition" disabled={!isPlaying}>
          <SkipBack className="h-4 w-4 text-muted-foreground" />
        </button>
        <button onClick={isPlaying ? reset : play}
          className="p-3 rounded-full gradient-amber text-primary-foreground hover:opacity-90 transition glow-primary">
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {chords.map((chord, i) => (
          <span key={i} className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
            currentIdx === i ? 'gradient-amber text-primary-foreground glow-primary-strong' : 'bg-secondary text-foreground border border-border'
          }`}>{chord}</span>
        ))}
      </div>
    </div>
  );
};

export default ProgressionPlayer;
