const LyricsViewer = ({ lyrics }) => {
  const renderLine = (line, idx) => {
    const parts = line.split(/(\[[A-G][#b]?[a-z0-9]*\])/g);
    const hasChords = parts.some(p => /^\[[A-G][#b]?[a-z0-9]*\]$/.test(p));

    if (!hasChords) {
      return (
        <div key={idx} className="text-foreground whitespace-pre-wrap">
          {line || '\u00A0'}
        </div>
      );
    }

    let chordLine = '';
    let textLine = '';

    parts.forEach(part => {
      if (/^\[[A-G][#b]?[a-z0-9]*\]$/.test(part)) {
        const chord = part.slice(1, -1);
        while (chordLine.length < textLine.length) chordLine += ' ';
        chordLine += chord;
      } else {
        while (textLine.length < chordLine.length) textLine += ' ';
        textLine += part;
      }
    });

    return (
      <div key={idx}>
        <div className="text-primary font-bold whitespace-pre" style={{ lineHeight: '1.4' }}>
          {chordLine || '\u00A0'}
        </div>
        <div className="text-foreground whitespace-pre-wrap" style={{ lineHeight: '1.4' }}>
          {textLine || '\u00A0'}
        </div>
      </div>
    );
  };

  return (
    <div className="font-mono text-sm space-y-0.5 p-4 bg-secondary/50 rounded-lg border border-border">
      {lyrics.split('\n').map((line, i) => renderLine(line, i))}
    </div>
  );
};

export default LyricsViewer;
