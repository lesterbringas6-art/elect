import { useEffect, useState } from 'react';
import axios from 'axios';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart3, PieChart } from 'lucide-react';

const Reports = () => {
  const { songs, chords } = useData();
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const chordUsage = {};
  songs.forEach(s => {
    const chordNames = s.chords ? (typeof s.chords === 'string' ? s.chords.split(',') : s.chords) : [];
    chordNames.forEach(c => { chordUsage[c.trim()] = (chordUsage[c.trim()] || 0) + 1; });
  });
  const topChords = Object.entries(chordUsage).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const difficultyBreakdown = {
    beginner: chords.filter(c => c.difficulty === 'beginner').length,
    intermediate: chords.filter(c => c.difficulty === 'intermediate').length,
    advanced: chords.filter(c => c.difficulty === 'advanced').length,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Most Used Chords</h3>
          <div className="space-y-2">
            {topChords.map(([name, count]) => (
              <div key={name} className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground w-8">{name}</span>
                <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                  <div className="h-full gradient-amber rounded-full transition-all" style={{ width: `${(count / (topChords[0]?.[1] || 1)) * 100}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
              </div>
            ))}
            {topChords.length === 0 && <p className="text-sm text-muted-foreground">No data yet</p>}
          </div>
        </div>
        <div className="glass rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><PieChart className="h-5 w-5 text-primary" /> Chord Difficulty</h3>
          <div className="space-y-3">
            {Object.entries(difficultyBreakdown).map(([level, count]) => (
              <div key={level} className="flex items-center justify-between">
                <span className={`text-sm px-2 py-0.5 rounded-full capitalize ${
                  level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                  level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                }`}>{level}</span>
                <span className="text-lg font-bold text-foreground">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Users</span>
              <span className="font-semibold text-foreground">{users.length}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Total Songs</span>
              <span className="font-semibold text-foreground">{songs.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
