import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { Link } from 'react-router-dom';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingAPI.getUserBookings(1, 20);
        setBookings(response.data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Initialize cancellation sequence?')) {
      try {
        setCancelling(bookingId);
        await bookingAPI.cancelBooking(bookingId, 'User request');
        setBookings((prev) => prev.map((b) =>
          b._id === bookingId ? { ...b, status: 'CANCELLED' } : b
        ));
      } catch (err) {
        setError(err.response?.data?.message || 'Cancellation failed');
      } finally {
        setCancelling(null);
      }
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-primary/10 text-primary border-primary/30';
      case 'RESERVED': return 'bg-secondary/10 text-secondary border-secondary/30';
      case 'COMPLETED': return 'bg-white/10 text-white border-white/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-white/5 text-muted-foreground border-white/10';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-cyber-in min-h-screen pb-20 pt-32">
      <div className="main-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic mb-2">
              My <span className="text-primary glow-text">Reservations</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Tracking all active and historical infrastructure bookings.</p>
          </div>
          <Link 
            to="/dashboard" 
            className="btn-cyber-primary text-xs"
          >
            New Reservation +
          </Link>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-8" />}

        {bookings.length === 0 ? (
          <div className="cyber-glass rounded-[3rem] border-white/10 p-20 text-center">
            <div className="text-6xl mb-6">🎟️</div>
            <h2 className="text-2xl font-bold text-white mb-2 uppercase italic tracking-widest">Database Empty</h2>
            <p className="text-muted-foreground text-sm mb-10 max-w-xs mx-auto">No booking records found in the current user context.</p>
            <Link 
              to="/dashboard" 
              className="btn-cyber-outline"
            >
              Explore Network
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking, i) => (
              <div 
                key={booking._id} 
                className="group relative cyber-glass rounded-[2.5rem] border-white/10 overflow-hidden hover:border-primary/40 transition-all hover:shadow-[0_0_50px_rgba(0,242,255,0.05)] animate-cyber-scale"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Left: Metadata */}
                  <div className="lg:w-1/3 p-8 bg-white/5 border-b lg:border-b-0 lg:border-r border-white/5">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        🏢
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white uppercase italic leading-none">{booking.lotId?.name || 'Unknown Lot'}</h3>
                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-2">{booking.lotId?.location || 'Unknown Location'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-center">
                        <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-2">Auth Status</p>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <Link 
                        to={`/booking-confirmation/${booking._id}`}
                        className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-center block transition-all text-white/70 hover:text-white"
                      >
                        Terminal Access
                      </Link>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="lg:w-2/3 p-8 flex flex-col justify-between relative">
                    {/* Decorative background numbers */}
                    <div className="absolute top-4 right-8 font-mono text-[60px] font-black text-white/[0.03] select-none pointer-events-none">
                      #{booking.bookingId?.slice(-4).toUpperCase() || '????'}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">Infrastructure ID</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-white italic">SLOT {booking.slotId?.slotNumber || '??'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">Timestamp</p>
                        <p className="text-sm font-bold text-white">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        <p className="text-[11px] text-muted-foreground font-medium">{new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">Access Reference</p>
                        <p className="text-xs font-mono font-bold text-primary/70">{booking.bookingId?.toUpperCase() || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 mt-8 border-t border-dashed border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">
                          {booking.status === 'COMPLETED' ? '💰' : '⏱️'}
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">
                            {booking.status === 'COMPLETED' ? 'Settled Amount' : 'Current Rate'}
                          </p>
                          <p className={`text-xl font-black italic ${booking.status === 'COMPLETED' ? 'text-secondary' : 'text-primary'}`}>
                            ${booking.status === 'COMPLETED' ? (booking.totalCost || 0).toFixed(2) : (booking.lotId?.pricePerHour || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full sm:w-auto">
                        {['RESERVED', 'ACTIVE'].includes(booking.status) && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancelling === booking._id}
                            className="flex-1 sm:flex-initial px-6 py-3 rounded-xl border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                          >
                            Abort Sequence
                          </button>
                        )}
                        <button className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all">
                          Export Log
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
