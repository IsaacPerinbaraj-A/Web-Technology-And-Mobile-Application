import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parkingLotAPI } from '../services/api';
import Alert from '../components/Alert';

export default function AdminLotsPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [totalSlots, setTotalSlots] = useState('');
  const [pricePerHour, setPricePerHour] = useState('5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !location || !address || !city || !totalSlots) {
      setError('All protocol fields are required');
      return;
    }

    try {
      setLoading(true);
      await parkingLotAPI.createLot({
        name,
        location,
        address,
        city,
        totalSlots: parseInt(totalSlots),
        pricePerHour: parseFloat(pricePerHour),
      });

      setSuccess('Infrastructure node initialized successfully!');
      setName('');
      setLocation('');
      setAddress('');
      setCity('');
      setTotalSlots('');
      setPricePerHour('5');

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Node initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-cyber-in min-h-screen pb-20 pt-32">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <button onClick={() => navigate('/admin/dashboard')} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-white">←</button>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Initialize <span className="text-primary glow-text">Node</span>
            </h1>
            <p className="text-muted-foreground font-medium">Add new infrastructure sectors to the global parking network.</p>
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-8" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-8" />}

        <div className="cyber-glass rounded-[3rem] border-white/10 p-10 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Node Designation</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                placeholder="DOWNTOWN_HUB_01"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Sector</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                  placeholder="NORTH_DISTRICT"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">City Code</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                  placeholder="NEW_YORK"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Physical Coordinates</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                placeholder="123 MAIN ST, LV-426"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Node Capacity</label>
                <input
                  type="number"
                  value={totalSlots}
                  onChange={(e) => setTotalSlots(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                  placeholder="100"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Operating Fee ($/HR)</label>
                <input
                  type="number"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                  placeholder="5"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cyber-primary py-5 text-xs mt-6"
            >
              {loading ? 'Initializing Node...' : 'Commit Infrastructure'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
