import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const DataContext = createContext(undefined);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const DataProvider = ({ children }) => {
  const { token } = useAuth();
  const [chords, setChords] = useState([]);
  const [songs, setSongs] = useState([]);
  const [personalSongs, setPersonalSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch chords from API
  const fetchChords = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/chords`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChords(response.data || []);
    } catch (error) {
      console.error('Failed to fetch chords:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch songs from API
  const fetchSongs = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/songs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSongs(response.data || []);
    } catch (error) {
      console.error('Failed to fetch songs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch personal songs from API
  const fetchPersonalSongs = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/personal-songs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPersonalSongs(response.data || []);
    } catch (error) {
      console.error('Failed to fetch personal songs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load when token is available
  useEffect(() => {
    if (token) {
      fetchChords();
      fetchSongs();
      fetchPersonalSongs();
    }
  }, [token]);

  // Chord operations
  const addChord = async (chord) => {
    try {
      const response = await axios.post(`${API_URL}/api/chords`, chord, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChords([...chords, response.data]);
      return response.data;
    } catch (error) {
      console.error('Failed to add chord:', error);
      throw error;
    }
  };

  const updateChord = async (id, updates) => {
    try {
      const response = await axios.put(`${API_URL}/api/chords/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChords(chords.map(c => c.id === id ? response.data : c));
      return response.data;
    } catch (error) {
      console.error('Failed to update chord:', error);
      throw error;
    }
  };

  const deleteChord = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/chords/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChords(chords.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete chord:', error);
      throw error;
    }
  };

  // Song operations
  const addSong = async (song) => {
    try {
      const response = await axios.post(`${API_URL}/api/songs`, song, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSongs([...songs, response.data]);
      return response.data;
    } catch (error) {
      console.error('Failed to add song:', error);
      throw error;
    }
  };

  const updateSong = async (id, updates) => {
    try {
      const response = await axios.put(`${API_URL}/api/songs/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSongs(songs.map(s => s.id === id ? response.data : s));
      return response.data;
    } catch (error) {
      console.error('Failed to update song:', error);
      throw error;
    }
  };

  const deleteSong = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/songs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSongs(songs.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete song:', error);
      throw error;
    }
  };

  const toggleFavorite = async (songId, songType = 'global') => { //new
    if (!token) return;

    try {
      // 1. Call the actual toggle endpoint in your index.js
      const response = await axios.post(`${API_URL}/api/favorites`, 
        { songId, songType }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Determine if it was added or removed based on your backend response
      const isNowFavorite = response.status === 201; // 201 = Created/Added, 200 = Deleted/Removed

      // 3. Update the local state for Global Songs
      setSongs(prevSongs => prevSongs.map(s => 
        s.id === songId ? { ...s, is_favorite: isNowFavorite } : s
      ));

      // 4. Update the local state for Personal Songs
      setPersonalSongs(prevPersonal => prevPersonal.map(s => 
        s.id === songId ? { ...s, is_favorite: isNowFavorite } : s
      ));

    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  // Personal song operations
  const addPersonalSong = async (song) => {
    try {
      const response = await axios.post(`${API_URL}/api/personal-songs`, song, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPersonalSongs([...personalSongs, response.data]);
      return response.data;
    } catch (error) {
      console.error('Failed to add personal song:', error);
      throw error;
    }
  };

  const updatePersonalSong = async (id, updates) => {
    try {
      const response = await axios.put(`${API_URL}/api/personal-songs/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPersonalSongs(personalSongs.map(s => s.id === id ? response.data : s));
      return response.data;
    } catch (error) {
      console.error('Failed to update personal song:', error);
      throw error;
    }
  };

  const deletePersonalSong = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/personal-songs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPersonalSongs(personalSongs.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete personal song:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      chords, songs, personalSongs, isLoading,
      fetchChords, fetchSongs, fetchPersonalSongs,
      addChord, updateChord, deleteChord,
      addSong, updateSong, deleteSong,
      toggleFavorite,
      addPersonalSong, updatePersonalSong, deletePersonalSong
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
