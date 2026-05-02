import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parkingLotAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function AdminEditLotPage() {
  const { lotId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    city: '',
    pricePerHour: '5',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchLot = async () => {
      try {
        setLoading(true);
        const response = await parkingLotAPI.getLot(lotId);
        const lot = response.data.lot;
        setFormData({
          name: lot.name,
          location: lot.location,
          address: lot.address,
          city: lot.city,
          pricePerHour: lot.pricePerHour.toString(),
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to sync with node');
      } finally {
        setLoading(false);
      }
    };
    fetchLot();
  }, [lotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSaving(true);
      await parkingLotAPI.updateLot(lotId, {
        ...formData,
        pricePerHour: parseFloat(formData.pricePerHour),
      });
      setSuccess('Infrastructure parameters updated successfully.');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Update protocol failure');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-cyber-in min-h-screen pb-20 pt-32">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <button onClick={() => navigate('/admin/dashboard')} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-white">←</button>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Edit <span className="text-secondary glow-text">Node</span>
            </h1>
            <p className="text-muted-foreground font-medium">Reconfigure infrastructure parameters for node {lotId.slice(-6).toUpperCase()}.</p>
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Sector</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">City Code</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Physical Coordinates</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">Operating Fee ($/HR)</label>
              <input
                type="number"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                step="0.01"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full btn-cyber-primary py-5 text-xs mt-6 bg-secondary/80 border-secondary"
            >
              {saving ? 'UPDATING...' : 'SAVE CONFIGURATION'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
