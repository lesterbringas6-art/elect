import { Trash2, Shield, User as UserIcon, Plus, Edit, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const emptyUserForm = { name: '', email: '', password: '', role: 'user' };
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyUserForm);
  
  // Status states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch Users from Database
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load users from database.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAdd = () => {
    setEditingUser(null);
    setForm(emptyUserForm);
    setShowForm(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    // Don't populate password field for security
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setError('');
  };

  // 2. Create or Update User in Database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (editingUser) {
        // Update logic: Only send password if it's not empty
        const updateData = { ...form };
        if (!updateData.password) delete updateData.password;
        
        await axios.put(`${API_URL}/api/users/${editingUser.id}`, updateData);
      } else {
        // Create logic
        await axios.post(`${API_URL}/api/users`, form);
      }
      
      await fetchUsers(); // Refresh the list
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Delete User from Database
  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const inputClass = "w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
        <button 
          onClick={openAdd} 
          className="px-4 py-2 gradient-amber rounded-md font-medium text-primary-foreground text-sm hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-lg p-6 border border-primary/20 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{editingUser ? 'Edit' : 'Add'} User</h3>
            <button onClick={closeForm} className="p-1 hover:bg-secondary rounded-md transition"><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>

          {error && <p className="text-destructive text-xs mb-4 bg-destructive/10 p-2 rounded border border-destructive/20">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className={inputClass} placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className={inputClass} placeholder="user@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">
                  Password {editingUser && <span className="text-muted-foreground text-[10px]">(Leave blank to keep current)</span>}
                </label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editingUser} className={inputClass} placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={inputClass}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-4 py-2 gradient-amber rounded-md font-medium text-primary-foreground text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingUser ? 'Update' : 'Create'} User
              </button>
              <button type="button" onClick={closeForm} className="px-4 py-2 bg-secondary rounded-md text-sm text-muted-foreground hover:text-foreground transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass rounded-lg overflow-hidden border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-4 text-muted-foreground font-medium">Name</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Email</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Role</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Joined</th>
                <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></td>
                </tr>
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-secondary/50 transition">
                  <td className="p-4 font-semibold text-foreground">{u.name}</td>
                  <td className="p-4 text-muted-foreground">{u.email}</td>
                  <td className="p-4">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 w-fit border ${
                      u.role === 'admin' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-secondary text-muted-foreground border-border'
                    }`}>
                      {u.role === 'admin' ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(u)} className="p-2 hover:bg-secondary rounded-md transition text-muted-foreground hover:text-primary"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => deleteUser(u.id)} className="p-2 hover:bg-destructive/10 rounded-md transition text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && users.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <UserIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No users found in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;