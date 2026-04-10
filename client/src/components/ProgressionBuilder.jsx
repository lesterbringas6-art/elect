import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, ChevronRight, Trophy, Star, RotateCcw } from 'lucide-react';
import ChordDiagram from './ChordDiagram';

const LEVEL_DATA = [
  { id: 1, title: 'First Steps', description: 'Learn the two easiest open chords', chordNames: ['Em', 'Am'] },
  { id: 2, title: 'Open Majors I', description: 'Add the essential C and G chords', chordNames: ['C', 'G'] },
  { id: 3, title: 'Open Majors II', description: 'Complete the major open chords', chordNames: ['D', 'A', 'E'] },
  { id: 4, title: 'Open Minors', description: 'Learn the remaining open minor chord', chordNames: ['Dm'] },
  { id: 5, title: 'Barre Chords', description: 'Master the challenging barre chord shapes', chordNames: ['F', 'Bm', 'B', 'F#m'] },
  { id: 6, title: 'Power & Suspended', description: 'Learn power chords and suspended voicings', chordNames: ['G5', 'A5', 'Dsus4', 'Asus2'] },
  { id: 7, title: 'Seventh Chords', description: 'Add color with major 7th and dominant 7th chords', chordNames: ['Cmaj7', 'G7', 'Am7', 'Fmaj7', 'E7'] },
  { id: 8, title: 'Jazz Voicings', description: 'Explore diminished, 9th, and 13th chords', chordNames: ['Bm7', 'C9'] },
  { id: 9, title: 'Expert Chords', description: 'Master slash chords, altered dominants, and extensions', chordNames: ['D/F#', 'E7#9', 'G13b9', 'F#m11', 'Amaj9', 'Cdim7'] },
];

const ProgressionBuilder = () => {
  const { chords } = useData();
  const [completedChords, setCompletedChords] = useState(() => {
    const stored = localStorage.getItem('electrum_chord_progress');
    return stored ? JSON.parse(stored) : [];
  });
  const [activeLevel, setActiveLevel] = useState(null);
  const [practicingChord, setPracticingChord] = useState(null);

  useEffect(() => {
    localStorage.setItem('electrum_chord_progress', JSON.stringify(completedChords));
  }, [completedChords]);

  const levels = LEVEL_DATA.map((lvl, idx) => {
    const prevCompleted = idx === 0 || LEVEL_DATA.slice(0, idx).every(prev =>
      prev.chordNames.every(cn => completedChords.includes(cn))
    );
    return {
      ...lvl,
      unlocked: prevCompleted,
      completed: lvl.chordNames.every(cn => completedChords.includes(cn)),
    };
  });

  const totalChords = LEVEL_DATA.reduce((sum, l) => sum + l.chordNames.length, 0);
  const progressPercent = Math.round((completedChords.length / totalChords) * 100);

  const markChordComplete = (name) => {
    if (!completedChords.includes(name)) {
      setCompletedChords(prev => [...prev, name]);
    }
  };

  const resetProgress = () => {
    setCompletedChords([]);
    setActiveLevel(null);
    setPracticingChord(null);
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Your Progress</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-primary">{completedChords.length}/{totalChords} chords</span>
            <button onClick={resetProgress} className="text-muted-foreground hover:text-destructive transition p-1" title="Reset progress">
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.6 }} />
        </div>
        {progressPercent === 100 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-primary mt-2 font-medium flex items-center gap-1">
            <Star className="h-4 w-4" /> Congratulations! You&apos;ve mastered all chord levels!
          </motion.p>
        )}
      </div>

      <div className="space-y-3">
        {levels.map((level) => {
          const isActive = activeLevel === level.id;
          const levelChords = level.chordNames.map(name => chords.find(c => c.name === name)).filter(Boolean);
          const completedInLevel = level.chordNames.filter(cn => completedChords.includes(cn)).length;

          return (
            <motion.div key={level.id} layout className="glass rounded-lg overflow-hidden">
              <button
                onClick={() => level.unlocked && setActiveLevel(isActive ? null : level.id)}
                disabled={!level.unlocked}
                className={`w-full flex items-center gap-4 p-4 text-left transition ${
                  level.unlocked ? 'hover:bg-accent/50 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 transition ${
                  level.completed ? 'border-primary bg-primary/20 text-primary' : level.unlocked ? 'border-primary/50 text-primary' : 'border-border text-muted-foreground'
                }`}>
                  {level.completed ? <CheckCircle className="h-5 w-5" /> : level.unlocked ? <span className="font-bold text-sm">{level.id}</span> : <Lock className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm">{level.title}</h4>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-muted-foreground">{completedInLevel}/{level.chordNames.length}</span>
                  {level.unlocked && <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isActive ? 'rotate-90' : ''}`} />}
                </div>
              </button>

              <AnimatePresence>
                {isActive && level.unlocked && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="px-4 pb-4 border-t border-border pt-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {levelChords.map(chord => {
                          if (!chord) return null;
                          const isDone = completedChords.includes(chord.name);
                          const isPracticing = practicingChord === chord.name;

                          return (
                            <motion.div key={chord.id} whileHover={{ scale: 1.02 }}
                              className={`rounded-lg border p-3 text-center transition cursor-pointer ${
                                isDone ? 'border-primary/50 bg-primary/10' : isPracticing ? 'border-primary bg-primary/5 ring-2 ring-primary/30' : 'border-border hover:border-primary/30'
                              }`}
                              onClick={() => setPracticingChord(isPracticing ? null : chord.name)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-foreground text-lg">{chord.name}</span>
                                {isDone && <CheckCircle className="h-4 w-4 text-primary" />}
                              </div>
                              <div className="flex justify-center mb-2">
                                <ChordDiagram chord={chord} size="sm" />
                              </div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{chord.category}</span>
                              <AnimatePresence>
                                {isPracticing && !isDone && (
                                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); markChordComplete(chord.name); setPracticingChord(null); }}
                                      className="mt-2 w-full text-xs px-2 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition font-medium"
                                    >
                                      Mark as Learned ✓
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              {isDone && <p className="text-[10px] text-primary mt-1 font-medium">Mastered</p>}
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="mt-4 p-3 rounded-md bg-accent/50 border border-border">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">Tip:</span>{' '}
                          {level.id <= 2 ? 'Focus on clean, buzzer-free sound. Press firmly behind the fret with your fingertips.'
                            : level.id <= 4 ? 'Practice switching between chords slowly, then increase speed.'
                            : level.id <= 5 ? 'For barre chords, use the side of your index finger and keep your thumb behind the neck.'
                            : level.id <= 6 ? 'Power chords use just 2-3 strings. Mute unused strings.'
                            : level.id <= 7 ? 'Seventh chords add richness. Focus on letting all notes ring clearly.'
                            : level.id <= 8 ? 'Jazz voicings require precise finger placement. Practice each shape slowly.'
                            : 'Expert chords combine advanced techniques. Take your time.'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressionBuilder;
