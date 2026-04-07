import { useEffect, useState } from 'react';
import axios from 'axios';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Music, Users, ListMusic, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
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

  const stats = [
    { label: 'Total Songs', value: songs.length, icon: Music },
    { label: 'Total Chords', value: chords.length, icon: ListMusic },
    { label: 'Registered Users', value: users.length, icon: Users },
    { label: 'Favorites Given', value: songs.filter(s => s.is_favorite).length, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin <span className="text-primary text-glow">Dashboard</span></h1>
        <p className="text-muted-foreground mt-1">Manage your Electrum platform</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-lg p-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg gradient-amber flex items-center justify-center">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
