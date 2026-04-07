import ChordDiagram from './ChordDiagram';
import { motion } from 'framer-motion';

const ChordCard = ({ chord, onClick }) => (
  <motion.div whileHover={{ y: -4, scale: 1.02 }} onClick={onClick}
    className="glass rounded-lg p-4 cursor-pointer hover:border-primary/50 transition group">
    <div className="flex flex-col items-center gap-3">
      <ChordDiagram chord={chord} size="sm" />
      <div className="text-center">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition">{chord.name}</h3>
        <p className="text-xs text-muted-foreground">{chord.type}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
          chord.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
          chord.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>{chord.difficulty}</span>
      </div>
    </div>
  </motion.div>
);

export default ChordCard;
