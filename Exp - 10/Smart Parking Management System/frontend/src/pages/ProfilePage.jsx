import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/Alert';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        vehicleNumber: user.vehicleNumber || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      await updateProfile(formData);
      setSuccess('Profile sync completed successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Sync failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-cyber-in min-h-screen pb-20 pt-24 sm:pt-32 flex items-center justify-center">
      <div className="max-w-5xl w-full px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          
          {/* Left: Identity Card */}
          <div className="lg:w-1/3">
            <div className="h-full cyber-glass rounded-[3rem] border-white/10 p-10 text-center relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent" />
              
              <div className="relative z-10 pt-4">
                <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-5xl text-black mx-auto border-4 border-[#030409] shadow-[0_0_40px_rgba(0,242,255,0.3)] mb-8 font-black italic">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">{user?.name}</h2>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8">{user?.email}</p>
                
                <div className="flex justify-center gap-3 mb-12">
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                    {user?.role}
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20">
                    Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 text-left pt-10 border-t border-white/5">
                  <div>
                    <p className="text-[9px] font-black text-muted uppercase tracking-widest">Registry</p>
                    <p className="font-bold text-sm text-white italic">{new Date(user?.createdAt).getFullYear()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted uppercase tracking-widest">Status</p>
                    <p className="font-bold text-sm text-secondary italic uppercase tracking-widest">Online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interface Settings */}
          <div className="lg:w-2/3">
            <div className="h-full cyber-glass rounded-[3rem] border-white/10 p-10 lg:p-14">
              <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-10">
                User <span className="text-primary glow-text">Infrastructure</span>
              </h1>

              {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-8" />}
              {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-8" />}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Alias Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                      placeholder="ENTER_NAME"
                      required
                    />
                  </div>

                  <div className="space-y-2 opacity-60">
                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Primary Protocol</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-muted-foreground font-mono text-sm cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Signal Reference</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                      placeholder="+XX XXX XXX XXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Vehicle Node ID</label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                      placeholder="XXXX-0000"
                    />
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex justify-end gap-6">
                  <button
                    type="button"
                    className="text-[10px] font-black text-muted uppercase tracking-[0.2em] hover:text-white transition-colors"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-cyber-primary px-12 text-xs"
                  >
                    {loading ? 'Synchronizing...' : 'Update Infrastructure'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
