import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/Alert';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#030409]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl flex flex-col md:flex-row-reverse cyber-glass rounded-[2rem] sm:rounded-[3rem] border-white/5 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-cyber-in relative z-10">
        
        {/* Left: Branding */}
        <div className="md:w-5/12 p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-secondary/10 to-primary/10 flex flex-col justify-between border-b md:border-b-0 md:border-l border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-12 sm:mb-16">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center text-lg sm:text-xl shadow-[0_0_20px_rgba(0,242,255,0.3)]">🅿️</div>
              <span className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter">Park<span className="text-primary glow-text">Core</span></span>
            </Link>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-6">
              Join <br />
              The <span className="text-secondary">Network</span>
            </h2>
            <p className="text-muted-foreground font-medium text-base sm:text-lg leading-relaxed max-w-sm">
              Initialize your user profile and start accessing premium vehicle infrastructure.
            </p>
          </div>

          <div className="relative z-10 pt-8 sm:pt-12 flex gap-4 hidden sm:flex">
            <div className="w-12 h-1 gap-1 flex">
              <div className="flex-1 bg-white/10 rounded-full" />
              <div className="flex-1 bg-secondary rounded-full" />
              <div className="flex-1 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="md:w-7/12 p-8 sm:p-12 lg:p-16 bg-black/20 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-widest mb-6 sm:mb-8">Registration</h3>
            
            {error && <Alert type="error" message={error} className="mb-6" />}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] ml-1">Alias Name</label>
                <input
                  type="text"
                  required
                  placeholder="USER_NAME"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] ml-1">Email Protocol</label>
                <input
                  type="email"
                  required
                  placeholder="USER@NETWORK.CORE"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] ml-1">Access Token</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] ml-1">Verify Token</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-cyber-primary py-4 text-xs mt-6 border-secondary/50 text-white bg-secondary/80 hover:bg-secondary"
              >
                {loading ? 'Initializing...' : 'Confirm Registration'}
              </button>
            </form>

            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-8 font-medium">
              Already in the grid? <Link to="/login" className="text-secondary hover:glow-text transition-all font-bold italic">Initialize Session</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
