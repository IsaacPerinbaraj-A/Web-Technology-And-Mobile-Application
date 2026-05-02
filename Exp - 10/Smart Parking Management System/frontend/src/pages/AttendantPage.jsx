import React, { useState } from 'react';
import { bookingAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom';

export default function AttendantPage() {
  const [bookingCode, setBookingCode] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!bookingCode) return;
    
    setError('');
    setBooking(null);
    setSuccess('');
    
    try {
      setLoading(true);
      const response = await bookingAPI.getBookingByCode(bookingCode);
      setBooking(response.data.booking);
    } catch (err) {
      setError(err.response?.data?.message || 'Signal not found in database');
    } finally {
      setLoading(false);
    }
  };

  const handleEntry = async () => {
    try {
      setActionLoading(true);
      await bookingAPI.markEntry(booking.bookingId);
      setSuccess('Entry protocol verified. Node status: OCCUPIED');
      setBooking(prev => ({ ...prev, status: 'ACTIVE', entryTime: new Date() }));
    } catch (err) {
      setError(err.response?.data?.message || 'Entry authorization failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExit = async () => {
    try {
      setActionLoading(true);
      await bookingAPI.markExit(booking.bookingId);
      setSuccess('Exit protocol completed. Node status: AVAILABLE');
      setBooking(prev => ({ ...prev, status: 'COMPLETED', exitTime: new Date() }));
    } catch (err) {
      setError(err.response?.data?.message || 'Exit authorization failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="animate-cyber-in min-h-screen pb-20 pt-32 flex items-center justify-center">
      <div className="max-w-4xl w-full px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-2">
            Terminal <span className="text-primary glow-text">Verification</span>
          </h1>
          <p className="text-muted-foreground font-medium">Attendant authorization interface for entry and exit protocols.</p>
        </div>

        <div className="cyber-glass rounded-[3rem] border-white/10 p-10 md:p-14 mb-10">
          <form onSubmit={handleLookup} className="flex flex-col md:flex-row gap-6">
            <div className="flex-grow relative group">
              <input
                type="text"
                placeholder="ENTER ACCESS TOKEN / BOOKING ID"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono text-lg tracking-[0.2em] uppercase"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20">🔎</div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-cyber-primary px-10"
            >
              {loading ? 'SCALING...' : 'SCAN NODE'}
            </button>
          </form>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-8" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-8" />}

        {booking && (
          <div className="animate-cyber-scale cyber-glass rounded-[3rem] border-white/10 overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
            <div className="p-10 md:p-14">
              <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-2">Operator Identity</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl border border-primary/20">
                        {booking.userId?.name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="text-xl font-black text-white uppercase italic leading-none">{booking.userId?.name}</p>
                        <p className="text-primary text-[10px] font-black tracking-widest mt-1 uppercase">{booking.userId?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-1">Infrastructure Node</p>
                      <p className="text-xl font-black text-white italic">SLOT {booking.slotId?.slotNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-1">Protocol Status</p>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        booking.status === 'ACTIVE' ? 'bg-primary/10 text-primary border-primary/20' : 
                        booking.status === 'RESERVED' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                        'bg-white/10 text-white border-white/20'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:w-64 p-8 rounded-[2rem] bg-black/40 border border-white/5 flex flex-col justify-center items-center text-center">
                  <p className="text-[9px] font-black text-muted uppercase tracking-[0.3em] mb-4">Location Reference</p>
                  <p className="text-sm font-bold text-white uppercase italic mb-1">{booking.lotId?.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{booking.lotId?.location}</p>
                </div>
              </div>

              <div className="flex gap-6">
                {booking.status === 'RESERVED' && (
                  <button
                    onClick={handleEntry}
                    disabled={actionLoading}
                    className="flex-1 btn-cyber-primary py-5 text-xs"
                  >
                    {actionLoading ? 'COMMITTING...' : 'AUTHORIZE ENTRY'}
                  </button>
                )}
                {booking.status === 'ACTIVE' && (
                  <button
                    onClick={handleExit}
                    disabled={actionLoading}
                    className="flex-1 btn-cyber-primary py-5 text-xs bg-secondary/80 border-secondary"
                  >
                    {actionLoading ? 'COMMITTING...' : 'AUTHORIZE EXIT'}
                  </button>
                )}
                <button
                  onClick={() => setBooking(null)}
                  className="px-10 py-5 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
                >
                  DISMISS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
