import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { parkingLotAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function DashboardPage() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLots = async () => {
      try {
        setLoading(true);
        const response = await parkingLotAPI.getLots(1, 20);
        setLots(response.data.lots);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch lots');
      } finally {
        setLoading(false);
      }
    };
    fetchLots();
  }, []);

  const filteredLots = lots.filter(lot => 
    lot.name.toLowerCase().includes(search.toLowerCase()) ||
    lot.location.toLowerCase().includes(search.toLowerCase()) ||
    lot.address.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-cyber-in min-h-screen pb-20 pt-24 sm:pt-32">
      {/* Header Section */}
      <div className="main-container mb-12 sm:mb-16">
        <div className="relative p-8 sm:p-10 lg:p-14 rounded-[2rem] sm:rounded-[3rem] cyber-glass border-primary/20 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-2 tracking-tighter uppercase italic">
              Network <span className="text-primary glow-text">Explorer</span>
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium mb-8">Access live availability across the global parking infrastructure.</p>
            
            <div className="relative max-w-xl">
              <input
                type="text"
                placeholder="Initialize scanning: search location..."
                className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-xs sm:text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <span className="hidden sm:inline text-[10px] font-black text-primary/50 uppercase tracking-widest">Scanning</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-container">
        {error && <Alert type="error" message={error} className="mb-8" />}

        {filteredLots.length === 0 ? (
          <div className="cyber-glass rounded-[2.5rem] border-white/10 p-20 text-center">
            <div className="text-6xl mb-6">📡</div>
            <h2 className="text-2xl font-bold text-white mb-2">Zero Signals Detected</h2>
            <p className="text-muted-foreground text-sm">No infrastructure matches your current search parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredLots.map((lot, i) => (
              <Link 
                key={lot._id} 
                to={`/slots/${lot._id}`}
                className="group relative cyber-glass rounded-[2rem] sm:rounded-[2.5rem] border-white/10 p-6 sm:p-8 hover:border-primary/40 transition-all hover:shadow-[0_0_40px_rgba(0,242,255,0.1)] animate-cyber-scale"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                    🏢
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] sm:text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Rate</p>
                    <p className="text-xl sm:text-2xl font-black text-white italic">${lot.pricePerHour}<span className="text-xs sm:text-sm font-normal text-muted-foreground not-italic">/hr</span></p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-primary transition-colors uppercase italic leading-none">{lot.name}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm font-medium mt-2 flex items-center gap-2">
                      <span className="text-primary">📍</span> {lot.location}
                    </p>
                  </div>

                  <div className="pt-4 sm:pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-[8px] sm:text-[9px] font-bold text-muted uppercase tracking-widest mb-1">Slots</p>
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border ${lot.availableSlots > 0 ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                          {lot.availableSlots} / {lot.totalSlots}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                      →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
