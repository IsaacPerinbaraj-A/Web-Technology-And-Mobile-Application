import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function BookingConfirmationPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await bookingAPI.getBooking(bookingId);
        setBooking(response.data.booking);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to authenticate booking');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-cyber-in min-h-screen pb-20 pt-48 flex items-center justify-center">
      <div className="max-w-4xl w-full px-4">
        {error && <Alert type="error" message={error} className="mb-8" />}

        {booking && (
          <div className="flex flex-col lg:flex-row gap-10 items-stretch">
            {/* Main Digital Ticket */}
            <div className="flex-grow group">
              <div className="relative h-full cyber-glass rounded-[3rem] border-primary/20 overflow-hidden flex flex-col shadow-[0_0_80px_rgba(0,242,255,0.1)]">
                {/* Neon Top Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
                
                <div className="p-10 md:p-12 flex-grow">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                      ✨
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter">Auth <span className="text-primary glow-text">Success</span></h1>
                      <p className="text-muted-foreground text-sm font-bold uppercase tracking-[0.2em] mt-1">Infrastructure Access Granted</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-10 mb-12">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Allocated Node</p>
                      <p className="text-3xl font-black text-white italic">SLOT {booking.slotId?.slotNumber || '??'}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Protocol Rate</p>
                      <p className="text-3xl font-black text-secondary italic">${booking.lotId?.pricePerHour || 0}<span className="text-sm not-italic">/hr</span></p>
                    </div>
                  </div>

                  <div className="p-8 rounded-[2rem] bg-black/40 border border-white/5 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">🏢</div>
                      <div>
                        <p className="text-lg font-black text-white uppercase italic leading-none mb-1">{booking.lotId?.name || 'Unknown Hub'}</p>
                        <p className="text-muted-foreground text-xs font-medium tracking-wide">{booking.lotId?.address || 'Restricted Coordinates'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] text-muted font-black uppercase tracking-[0.2em] pt-6 border-t border-white/5">
                      <span className="flex items-center gap-2">
                        <span className="text-primary">ID</span> {booking.bookingId?.toUpperCase() || 'N/A'}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-primary">DATE</span> {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-12">
                    <button
                      onClick={() => navigate('/my-bookings')}
                      className="flex-1 btn-cyber-primary text-xs"
                    >
                      Control Center
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="flex-1 btn-cyber-outline text-xs"
                    >
                      Network Scan
                    </button>
                  </div>
                </div>

                {/* Ticket Cutouts */}
                <div className="absolute top-1/2 -left-5 w-10 h-10 bg-[#030409] rounded-full -translate-y-1/2 border border-white/5 shadow-inner" />
                <div className="absolute top-1/2 -right-5 w-10 h-10 bg-[#030409] rounded-full -translate-y-1/2 border border-white/5 shadow-inner" />
              </div>
            </div>

            {/* Side Pass / QR */}
            <div className="lg:w-80 flex-shrink-0 flex flex-col gap-8">
              <div className="cyber-glass rounded-[3rem] border-white/10 p-10 text-center flex-grow flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px]" />
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-8 relative z-10">Access Token</p>
                
                <div className="relative z-10 bg-white p-6 rounded-3xl border-2 border-primary/20 shadow-[0_0_40px_rgba(0,242,255,0.15)] group-hover:scale-105 transition-transform">
                  {booking.qrCode ? (
                    <img src={booking.qrCode} alt="Access Token" className="w-40 h-40" />
                  ) : (
                    <div className="w-40 h-40 bg-black/5 flex items-center justify-center text-4xl opacity-20 italic">DATA</div>
                  )}
                </div>
                
                <p className="text-[11px] text-muted-foreground font-medium max-w-[180px] mx-auto mt-8 leading-relaxed relative z-10 italic">
                  Present this token at the infrastructure entry gate.
                </p>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-secondary/5 border border-secondary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 text-3xl opacity-20">⚠️</div>
                <h4 className="font-black text-secondary text-sm uppercase italic tracking-widest mb-2">Arrival Limit</h4>
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed italic">
                  Maintain arrival window within <strong className="text-secondary">30:00</strong> minutes to avoid sequence termination.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
