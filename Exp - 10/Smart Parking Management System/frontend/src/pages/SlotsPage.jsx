import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI, parkingLotAPI } from '../services/api';
import { useParking } from '../hooks/useParking';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const PaymentModal = ({ isOpen, onClose, onConfirm, lot, slot, isProcessing }) => {
  if (!isOpen || !lot || !slot) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md cyber-glass rounded-[2.5rem] border-primary/30 p-8 md:p-10 animate-cyber-scale shadow-[0_0_100px_rgba(0,242,255,0.2)] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-white transition-colors">✕</button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-4 border border-primary/20 shadow-[0_0_20px_rgba(0,242,255,0.2)]">
            💳
          </div>
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Auth Required</h3>
          <p className="text-muted-foreground text-sm font-medium mt-1">Initialize secure payment gateway</p>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Infrastructure</span>
              <span className="text-white">SLOT {slot.slotNumber}</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Estimated Arrival</span>
              <input 
                type="datetime-local" 
                className="bg-transparent text-primary text-[10px] font-black uppercase focus:outline-none border-b border-primary/20"
                defaultValue={new Date().toISOString().slice(0, 16)}
                id="arrival-time-input"
              />
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Operational Rate</span>
              <span className="text-primary">${lot.pricePerHour}/hr</span>
            </div>
            <div className="pt-3 border-t border-white/5 flex justify-between font-black uppercase tracking-tighter italic text-white">
              <span>Total Estimated</span>
              <span className="text-xl text-primary">${(lot.pricePerHour || 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input type="text" placeholder="CARD NUMBER" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-mono tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all" defaultValue="4242 4242 4242 4242" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">🔒</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="EXP (MM/YY)" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-mono text-white focus:outline-none focus:border-primary/50 transition-all" defaultValue="12/26" />
              <input type="password" placeholder="CVV" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-mono text-white focus:outline-none focus:border-primary/50 transition-all" defaultValue="***" />
            </div>
          </div>

          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="w-full btn-cyber-primary text-sm relative group overflow-hidden"
          >
            {isProcessing ? (
              <span className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Processing...
              </span>
            ) : 'Finalize Reservation'}
          </button>
          
          <p className="text-[9px] text-center text-muted-foreground uppercase tracking-widest font-bold">
            Encrypted with 256-bit AES protocols
          </p>
        </div>
      </div>
    </div>
  );
};

export default function SlotsPage() {
  const { lotId } = useParams();
  const navigate = useNavigate();
  const { slots, fetchSlots, clearLotData, loading: slotsLoading } = useParking();
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const lotRes = await parkingLotAPI.getLot(lotId);
        setLot(lotRes.data.lot);
        await fetchSlots(lotId);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to initialize database');
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      clearLotData();
    };
  }, [lotId, fetchSlots, clearLotData]);

  const handleSlotClick = (slot) => {
    if (slot.status !== 'AVAILABLE') return;
    setSelectedSlot(slot);
    setShowPayment(true);
  };

  const handlePaymentConfirm = async () => {
    try {
      const arrivalTime = document.getElementById('arrival-time-input')?.value;
      setIsProcessing(true);
      const response = await bookingAPI.createBooking({
        lotId,
        slotId: selectedSlot._id,
        startTime: arrivalTime ? new Date(arrivalTime).toISOString() : new Date().toISOString()
      });
      setTimeout(() => {
        navigate(`/booking-confirmation/${response.data.booking._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking sequence failed');
      setShowPayment(false);
      setIsProcessing(false);
    }
  };

  if (loading || slotsLoading) return <LoadingSpinner />;

  return (
    <div className="animate-cyber-in min-h-screen pb-20 pt-32">
      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => !isProcessing && setShowPayment(false)} 
        onConfirm={handlePaymentConfirm}
        lot={lot}
        slot={selectedSlot}
        isProcessing={isProcessing}
      />

      <div className="main-container">
        {lot && (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Section */}
            <div className="flex-grow">
              <div className="mb-10 sm:mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => navigate('/dashboard')} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-white">←</button>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase italic">
                    {lot.name} <span className="text-primary">Grid</span>
                  </h1>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <div className="w-3 h-3 rounded bg-secondary/20 border border-secondary" /> Available
                  </span>
                  <span className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500" /> Occupied
                  </span>
                </div>
              </div>

              {error && <Alert type="error" message={error} className="mb-8" />}

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
                {slots.map((slot, i) => (
                  <button
                    key={slot._id}
                    disabled={slot.status !== 'AVAILABLE'}
                    onClick={() => handleSlotClick(slot)}
                    className={`aspect-square rounded-2xl border-2 p-3 transition-all flex flex-col items-center justify-center relative group animate-cyber-scale overflow-hidden ${
                      slot.status !== 'AVAILABLE'
                        ? 'border-red-500/20 bg-red-500/5 cursor-not-allowed' 
                        : 'border-secondary/20 bg-secondary/5 hover:border-primary hover:shadow-[0_0_20px_rgba(0,242,255,0.2)] hover:scale-105 active:scale-95'
                    }`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {slot.status === 'AVAILABLE' && (
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent group-hover:animate-scan" />
                    )}
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter mb-1">Slot</span>
                    <span className={`text-xl font-black italic ${slot.status !== 'AVAILABLE' ? 'text-red-500 opacity-50' : 'text-white'}`}>
                      {slot.slotNumber}
                    </span>
                    {slot.status !== 'AVAILABLE' ? (
                      <span className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tighter">{slot.status}</span>
                    ) : (
                      <span className="text-[10px] font-bold text-secondary mt-1 uppercase tracking-tighter">Open</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sticky lot info sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-32 cyber-glass rounded-[2.5rem] border-white/10 p-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
                <div className="mb-8">
                  <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-4">Location Specs</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-1">Coordinates</p>
                      <p className="text-white font-medium text-sm leading-relaxed">{lot.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-1">Operating Fee</p>
                        <p className="text-xl font-black text-white italic">${lot.pricePerHour}<span className="text-xs not-italic text-muted-foreground">/hr</span></p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-1">Security</p>
                        <p className="text-sm font-bold text-secondary">Level 5</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-center text-muted-foreground font-medium italic">
                    "AI monitored parking zone. No physical key required."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
