import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getBookings(1, 20);
        setBookings(response.data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch global protocol logs');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-primary/10 text-primary border-primary/20';
      case 'RESERVED': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'COMPLETED': return 'bg-white/10 text-white border-white/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-white/5 text-muted-foreground border-white/10';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-cyber-in min-h-screen pb-20 pt-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <button onClick={() => navigate('/admin/dashboard')} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-white">←</button>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Protocol <span className="text-primary glow-text">Logs</span>
            </h1>
            <p className="text-muted-foreground font-medium">Complete historical data for all node reservations and infrastructure syncs.</p>
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-8" />}

        <div className="cyber-glass rounded-[3rem] border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Access Reference</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Operator</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Sector / Node</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Network Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Settlement</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em] text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-10 py-6">
                      <span className="font-mono text-xs text-primary/70 font-bold uppercase tracking-wider">{booking.bookingId?.toUpperCase() || 'N/A'}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-white border border-white/10">
                          {booking.userId?.name?.[0] || '?'}
                        </div>
                        <span className="font-bold text-white uppercase italic text-sm">{booking.userId?.name || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-white">{booking.lotId?.name || 'Unknown'}</p>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Node #{booking.slotId?.slotNumber || '??'}</p>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-sm font-black text-white italic">
                        {booking.totalCost ? `$${booking.totalCost.toFixed(2)}` : '--'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-[11px] font-bold text-muted-foreground text-right uppercase">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
