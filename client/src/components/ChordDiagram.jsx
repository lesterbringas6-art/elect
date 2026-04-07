const ChordDiagram = ({ chord, size = 'md' }) => {
  const dims = size === 'sm' ? { w: 80, h: 100, fs: 10 } : size === 'md' ? { w: 120, h: 150, fs: 12 } : { w: 160, h: 200, fs: 14 };
  const strings = 6;
  const frets = 5;
  const padX = 15;
  const padY = 20;
  const stringSpacing = (dims.w - padX * 2) / (strings - 1);
  const fretSpacing = (dims.h - padY * 2) / frets;

  return (
    <svg width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`} className="text-foreground">
      <line x1={padX} y1={padY} x2={dims.w - padX} y2={padY} stroke="hsl(42, 92%, 56%)" strokeWidth={3} />
      {Array.from({ length: frets + 1 }, (_, i) => (
        <line key={`f${i}`} x1={padX} y1={padY + i * fretSpacing} x2={dims.w - padX} y2={padY + i * fretSpacing}
          stroke="hsl(220, 14%, 25%)" strokeWidth={1} />
      ))}
      {Array.from({ length: strings }, (_, i) => (
        <line key={`s${i}`} x1={padX + i * stringSpacing} y1={padY} x2={padX + i * stringSpacing} y2={dims.h - padY + fretSpacing}
          stroke="hsl(220, 14%, 35%)" strokeWidth={1} />
      ))}
      {chord.frets.map((fret, i) => {
        const x = padX + i * stringSpacing;
        if (fret === -1) return <text key={i} x={x} y={padY - 6} textAnchor="middle" fontSize={dims.fs} fill="hsl(220, 10%, 55%)">×</text>;
        if (fret === 0) return <circle key={i} cx={x} cy={padY - 6} r={3} fill="none" stroke="hsl(42, 92%, 56%)" strokeWidth={1.5} />;
        return <circle key={i} cx={x} cy={padY + (fret - 0.5) * fretSpacing} r={4} fill="hsl(42, 92%, 56%)" />;
      })}
    </svg>
  );
};

export default ChordDiagram;
