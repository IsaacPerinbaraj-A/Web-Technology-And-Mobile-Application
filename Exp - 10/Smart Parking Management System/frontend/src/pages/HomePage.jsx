import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030409]">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-48 pb-32">
        <div className="flex flex-col items-center text-center">
          <div className="animate-cyber-in stagger-1 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              System Online v2.0
            </span>
          </div>
          
          <h1 className="animate-cyber-in stagger-2 text-6xl md:text-8xl font-black text-white leading-tight mb-8 tracking-tighter uppercase italic">
            Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary glow-text">
              Parking
            </span>
          </h1>
          
          <p className="animate-cyber-in stagger-3 text-muted-foreground text-lg md:text-xl max-w-2xl mb-12 font-medium leading-relaxed">
            AI-driven infrastructure for the modern city. Secure, seamless, and lightning fast parking solutions at your fingertips.
          </p>
          
          <div className="animate-cyber-in stagger-4 flex flex-col sm:flex-row gap-6">
            <Link to="/register" className="btn-cyber-primary group">
              Get Started Now
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link to="/dashboard" className="btn-cyber-outline">
              Explore Network
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '⚡', title: 'Zero Friction', desc: 'Instant bookings and contactless entry with our advanced AI scanning.' },
            { icon: '🛡️', title: 'High Security', desc: 'Bank-grade encryption and 24/7 automated lot monitoring.' },
            { icon: '📊', title: 'Live Insights', desc: 'Real-time occupancy tracking and dynamic pricing updates.' }
          ].map((f, i) => (
            <div key={i} className="animate-cyber-in cyber-glass p-10 rounded-[2.5rem] border-white/10 hover:border-primary/40 transition-all group">
              <div className="text-4xl mb-6 group-hover:scale-125 transition-transform">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider italic">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Scan Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50">
        <div className="h-full w-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      </div>
    </div>
  );
}
