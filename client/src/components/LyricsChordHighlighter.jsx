import React from 'react';

const LyricsChordHighlighter = ({ lyrics, highlightedChord }) => {
  const renderLine = (line, idx) => {
    // Splits the line by chord brackets, e.g., [Am]
    const parts = line.split(/(\[[A-G][#b]?[a-z0-9]*\])/g);
    const hasChords = parts.some(p => /^\[[A-G][#b]?[a-z0-9]*\]$/.test(p));

    if (!hasChords) {
      return (
        <div key={idx} className="text-foreground whitespace-pre-wrap">
          {line || '\u00A0'}
        </div>
      );
    }

    // Build segments: each is { chord?: string, text: string }
    const segments = [];
    let currentText = '';

    parts.forEach(part => {
      if (/^\[[A-G][#b]?[a-z0-9]*\]$/.test(part)) {
        if (currentText) {
          // Attach remaining text to previous segment or create textOnly
          if (segments.length > 0 && !segments[segments.length - 1].text) {
            segments[segments.length - 1].text = currentText;
          } else {
            segments.push({ text: currentText });
          }
          currentText = '';
        }
        segments.push({ chord: part.slice(1, -1), text: '' });
      } else {
        currentText += part;
      }
    });

    if (currentText) {
      if (segments.length > 0 && !segments[segments.length - 1].text) {
        segments[segments.length - 1].text = currentText;
      } else {
        segments.push({ text: currentText });
      }
    }

    return (
      <div key={idx} className="flex flex-wrap">
        {segments.map((seg, i) => (
          <span key={i} className="inline-flex flex-col">
            <span className={`font-bold text-sm h-5 transition ${
              seg.chord
                ? highlightedChord === seg.chord
                  ? 'bg-primary text-primary-foreground px-1 rounded'
                  : 'text-primary'
                : ''
            }`}>
              {seg.chord || '\u00A0'}
            </span>
            <span className="text-foreground whitespace-pre-wrap">
              {seg.text || '\u00A0'}
            </span>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="font-mono text-sm space-y-0.5">
      {lyrics?.split('\n').map((line, i) => renderLine(line, i))}
    </div>
  );
};

export default LyricsChordHighlighter;