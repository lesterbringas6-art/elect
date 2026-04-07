import { Music, Heart, ListMusic, Zap, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const { songs, chords, personalSongs } = useData();
  const favCount = songs.filter(s => s.is_favorite).length;
  const myCount = personalSongs.length;

  const stats = [
    { label: 'Song Library', value: songs.length, icon: Music, to: '/songs' },
    { label: 'My Songs', value: myCount, icon: PenTool, to: '/my-songs' },
    { label: 'Favorites', value: favCount, icon: Heart, to: '/songs' },
    { label: 'Chords', value: chords.length, icon: ListMusic, to: '/chords' },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, <span className="text-primary text-glow">{user?.name}</span></h1>
        <p className="text-muted-foreground mt-1">Your music companion dashboard</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={s.to} className="glass rounded-lg p-5 flex items-center gap-4 hover:border-primary/50 transition block">
              <div className="h-12 w-12 rounded-lg gradient-amber flex items-center justify-center">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="glass rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/songs" className="p-3 bg-secondary rounded-lg text-center hover:bg-primary/10 transition">
            <Music className="h-5 w-5 text-primary mx-auto mb-1" /><span className="text-sm text-foreground">Song Library</span>
          </Link>
          <Link to="/my-songs" className="p-3 bg-secondary rounded-lg text-center hover:bg-primary/10 transition">
            <PenTool className="h-5 w-5 text-primary mx-auto mb-1" /><span className="text-sm text-foreground">My Songs</span>
          </Link>
          <Link to="/chords" className="p-3 bg-secondary rounded-lg text-center hover:bg-primary/10 transition">
            <ListMusic className="h-5 w-5 text-primary mx-auto mb-1" /><span className="text-sm text-foreground">Chord Library</span>
          </Link>
          <Link to="/progression" className="p-3 bg-secondary rounded-lg text-center hover:bg-primary/10 transition">
            <Zap className="h-5 w-5 text-primary mx-auto mb-1" /><span className="text-sm text-foreground">Build Progression</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
