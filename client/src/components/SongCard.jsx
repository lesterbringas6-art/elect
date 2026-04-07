import { Music } from 'lucide-react';
import { motion } from 'framer-motion';
import FavoriteButton from './FavoriteButton';

const SongCard = ({ song, onClick, onToggleFavorite }) => (
  <motion.div 
    whileHover={{ y: -2 }} 
    onClick={onClick}
    className="glass rounded-lg p-4 cursor-pointer hover:border-primary/50 transition group"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Visual Icon with Brand Gradient */}
        <div className="h-10 w-10 rounded-md gradient-amber flex items-center justify-center flex-shrink-0">
          <Music className="h-5 w-5 text-primary-foreground" />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition">
            {song.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {song.artist}
          </p>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Key: {song.key}
            </span>
            {song.capo > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                Capo {song.capo}
              </span>
            )}
          </div>
        </div>
      </div>
      <FavoriteButton 
        isFavorite={!!song.is_favorite} //new
        onClick={onToggleFavorite} 
      />
    </div>
  </motion.div>
);

export default SongCard;