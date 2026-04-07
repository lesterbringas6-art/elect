import { Heart } from 'lucide-react';
const FavoriteButton = ({ isFavorite, onClick }) => (
  <button onClick={e => { e.stopPropagation(); onClick(); }}
    className="p-1.5 rounded-full hover:bg-secondary transition">
    <Heart className={`h-4 w-4 transition ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'}`} />
  </button>
);

export default FavoriteButton;
