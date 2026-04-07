import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Music, LogOut, User, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = user ? (
    isAdmin ? [
      { to: '/admin', label: 'Dashboard' },
      { to: '/admin/chords', label: 'Manage Chords' },
      { to: '/admin/songs', label: 'Manage Songs' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/reports', label: 'Reports' },
    ] : [
      { to: '/', label: 'Dashboard' },
      { to: '/songs', label: 'Song Library' },
      { to: '/my-songs', label: 'My Songs' },
      { to: '/chords', label: 'Chords' },
      { to: '/progression', label: 'Progression' },
    ]
  ) : [];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <Music className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary text-glow">Electrum</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-primary transition">{l.label}</Link>
          ))}
          {user && (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                {isAdmin ? <Shield className="h-3 w-3 text-primary" /> : <User className="h-3 w-3" />}
                {user.name}
              </span>
              <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-2">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
              className="block text-sm text-muted-foreground hover:text-primary py-1">{l.label}</Link>
          ))}
          {user && (
            <button onClick={handleLogout} className="text-sm text-destructive py-1">Sign out</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
