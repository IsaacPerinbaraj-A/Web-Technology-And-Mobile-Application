import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Explore', path: '/dashboard', role: 'user', icon: '🔍' },
    { name: 'Reservations', path: '/my-bookings', role: 'user', icon: '🎫' },
    { name: 'Terminal', path: '/attendant', role: 'attendant', icon: '📡' },
    { name: 'Control Panel', path: '/admin/dashboard', role: 'admin', icon: '🛡️' },
    { name: 'Profile', path: '/profile', authenticated: true, icon: '👤' },
  ];

  const activeLinkClass = "text-primary bg-primary/10 border-primary/20";
  const inactiveLinkClass = "text-muted-foreground hover:text-white hover:bg-white/5 border-transparent";

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="cyber-glass rounded-3xl px-6 py-4 flex justify-between items-center relative overflow-hidden">
        {/* Animated accent line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <Link to="/" className="flex items-center gap-3 group relative z-10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xl shadow-[0_0_20px_hsla(190,100%,50%,0.3)] group-hover:scale-110 transition-transform">
            🅿️
          </div>
          <span className="text-xl font-extrabold tracking-tighter text-white uppercase italic">
            Park<span className="text-primary glow-text">Core</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-2 items-center relative z-10">
          {isAuthenticated ? (
            <>
              <div className="flex gap-1 mr-4">
                {navLinks.filter(link => 
                  (!link.role || link.role === user?.role) && 
                  (!link.authenticated || isAuthenticated)
                ).map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all flex items-center gap-2 ${
                      location.pathname === link.path ? activeLinkClass : inactiveLinkClass
                    }`}
                  >
                    <span className="text-sm">{link.icon}</span>
                    {link.name}
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="text-right hidden lg:block">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{user?.role}</div>
                  <div className="text-xs font-bold text-white/90">{user?.name}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all active:scale-95"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Link 
                to="/login" 
                className="px-6 py-2.5 text-xs font-bold text-white hover:text-primary transition-colors uppercase tracking-widest"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="btn-cyber-primary"
              >
                Join Network
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 cyber-glass rounded-3xl p-6 border border-primary/20 animate-cyber-in">
          <div className="space-y-3">
            {isAuthenticated ? (
              <>
                {navLinks.filter(link => 
                  (!link.role || link.role === user?.role) && 
                  (!link.authenticated || isAuthenticated)
                ).map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all ${
                      location.pathname === link.path ? activeLinkClass : inactiveLinkClass
                    }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                >
                  <span className="text-xl">🚪</span>
                  Logout Session
                </button>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-4 rounded-2xl border border-white/10 font-bold text-white uppercase tracking-widest"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-cyber-primary"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
