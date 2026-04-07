import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, Mail, Lock, User, Shield, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminField, setShowAdminField] = useState(false);
  
  // Status States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(name, email, password, adminCode);
      setSuccessMsg('Account created! Please log in.');
      
      setTimeout(() => {
        // Redirect to the Login page
        navigate('/login'); 
      }, 2000);
    } catch (error) {
      setErrorMsg(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-dark px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Music className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-primary text-glow">Electrum</h1>
          </div>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <div className="glass rounded-lg p-8">
          {/* Feedback Messages */}
          {errorMsg && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-md p-3 mb-4 text-sm animate-pulse">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-500 rounded-md p-3 mb-4 text-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your name" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••" />
              </div>
            </div>

            <div>
              <button type="button" onClick={() => setShowAdminField(!showAdminField)}
                className="text-xs text-muted-foreground hover:text-primary transition flex items-center gap-1">
                <Shield className="h-3 w-3" /> {showAdminField ? 'Hide' : 'Have'} admin code?
              </button>
              {showAdminField && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-2">
                  <input type="text" value={adminCode} onChange={e => setAdminCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary border border-primary/30 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter admin secret code" />
                </motion.div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !!successMsg}
              className={`w-full py-2.5 rounded-md font-semibold transition glow-primary flex items-center justify-center gap-2 
                ${successMsg ? 'bg-green-600 text-white' : 'gradient-amber text-primary-foreground hover:opacity-90'}`}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {successMsg ? 'Success!' : isLoading ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
