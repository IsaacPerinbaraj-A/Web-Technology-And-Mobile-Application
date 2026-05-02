import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/Alert';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#030409]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl flex flex-col md:flex-row cyber-glass rounded-[2rem] sm:rounded-[3rem] border-white/5 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-cyber-in relative z-10">
        
        {/* Left: Branding */}
        <div className="md:w-5/12 p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-12 sm:mb-16">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center text-lg sm:text-xl shadow-[0_0_20px_rgba(0,242,255,0.3)]">🅿️</div>
              <span className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter">Park<span className="text-primary glow-text">Core</span></span>
            </Link>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-6">
              Access <br />
              The <span className="text-primary">Future</span>
            </h2>
            <p className="text-muted-foreground font-medium text-base sm:text-lg leading-relaxed max-w-sm">
              Log in to the secure parking network and manage your digital vehicle infrastructure.
            </p>
          </div>

          <div className="relative z-10 pt-8 sm:pt-12 flex gap-4 hidden sm:flex">
            <div className="w-12 h-1 gap-1 flex">
              <div className="flex-1 bg-primary rounded-full" />
              <div className="flex-1 bg-white/10 rounded-full" />
              <div className="flex-1 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="md:w-7/12 p-8 sm:p-12 lg:p-16 bg-black/20 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-widest mb-6 sm:mb-8">Identification</h3>
            
            {error && <Alert type="error" message={error} className="mb-6" />}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Secure Email</label>
                <input
                  type="email"
                  required
                  placeholder="USER@NETWORK.CORE"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-white placeholder:text-muted/40 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Access Token</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-white placeholder:text-muted/40 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-cyber-primary py-4 sm:py-5 text-xs mt-2"
              >
                {loading ? 'Validating...' : 'Initialize Session'}
              </button>
            </form>

            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-8 font-medium">
              New to the grid? <Link to="/register" className="text-primary hover:glow-text transition-all font-bold italic">Register Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
