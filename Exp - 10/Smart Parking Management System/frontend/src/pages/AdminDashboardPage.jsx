import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, bookingsRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getBookings(1, 10)
        ]);
        setStats(statsRes.data.stats);
        setRecentBookings(bookingsRes.data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to authorize with central core');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-cyber-in min-h-screen pb-20 pt-24 sm:pt-32">
      <div className="main-container">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
            Control <span className="text-primary glow-text">Panel</span>
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium mt-2">Real-time infrastructure oversight and protocol management.</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-8" />}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-12 sm:mb-16">
          {[
            { label: 'Network Nodes', value: stats?.totalLots || 0, icon: '🏢', color: 'text-primary' },
            { label: 'Active Sessions', value: stats?.activeBookings || 0, icon: '🎫', color: 'text-secondary' },
            { label: 'Verified Operators', value: stats?.totalUsers || 0, icon: '👥', color: 'text-white' },
            { label: 'Net Revenue', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, icon: '💰', color: 'text-primary' },
          ].map((stat, i) => (
            <div key={i} className="cyber-glass rounded-[1.5rem] sm:rounded-[2.5rem] border-white/10 p-5 sm:p-8 relative overflow-hidden group hover:border-primary/30 transition-all">
              <div className="absolute top-0 right-0 p-3 sm:p-4 text-xl sm:text-3xl opacity-10 group-hover:scale-110 transition-transform">{stat.icon}</div>
              <p className="text-[8px] sm:text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-1">{stat.label}</p>
              <p className={`text-xl sm:text-3xl lg:text-4xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Sector Management Section */}
        <div className="cyber-glass rounded-[3rem] border-white/10 overflow-hidden mb-16">
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Sector Management</h2>
            <Link to="/admin/lots" className="btn-cyber-primary text-[10px] py-3 px-6">Initialize New Node +</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.01]">
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Designation</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Sector</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Nodes</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Protocol Rate</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.lots?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-10 py-16 text-center text-muted-foreground font-mono text-sm uppercase italic">No infrastructure nodes registered</td>
                  </tr>
                ) : (
                  stats?.lots?.map((lot) => (
                    <tr key={lot._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-10 py-6">
                        <span className="font-bold text-white uppercase italic text-sm">{lot.name}</span>
                      </td>
                      <td className="px-10 py-6 text-sm font-medium text-muted-foreground">{lot.location}</td>
                      <td className="px-10 py-6">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-white tracking-widest">
                          {lot.totalSlots} NODES
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-sm font-black text-secondary italic">${lot.pricePerHour}/HR</span>
                      </td>
                      <td className="px-10 py-6 text-right flex justify-end gap-3">
                        <Link
                          to={`/admin/lots/edit/${lot._id}`}
                          className="px-4 py-1.5 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                        >
                          Config
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="cyber-glass rounded-[3rem] border-white/10 overflow-hidden mb-16">
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Recent Node Activity</h2>
            <Link to="/admin/bookings" className="text-xs font-black text-primary hover:glow-text transition-all uppercase tracking-widest">Full Log →</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.01]">
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Operator</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Sector</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Node ID</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em] text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-10 py-16 text-center text-muted-foreground font-mono text-sm uppercase italic">Zero signals detected in the last cycle</td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-black text-primary border border-primary/20 uppercase">
                            {booking.userId?.name?.[0] || '?'}
                          </div>
                          <span className="font-bold text-white uppercase italic text-sm">{booking.userId?.name || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-sm font-medium text-muted-foreground">{booking.lotId?.name || 'Unknown'}</td>
                      <td className="px-10 py-6">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-white tracking-widest">
                          #{booking.slotId?.slotNumber || '??'}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          booking.status === 'ACTIVE' ? 'bg-primary/10 text-primary border-primary/20' : 
                          booking.status === 'RESERVED' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                          'bg-white/10 text-white border-white/20'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-[11px] font-bold text-muted-foreground text-right uppercase">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'User Directory', path: '/admin/users', icon: '👤', desc: 'Manage access levels and monitor operator activity.' },
            { label: 'Global Logs', path: '/admin/bookings', icon: '📋', desc: 'Full historical data for all network sessions.' },
            { label: 'Reports', path: '#', icon: '📈', desc: 'Daily, weekly and monthly analytics (WIP).' },
          ].map((item, i) => (
            <Link key={i} to={item.path} className="cyber-glass rounded-[2.5rem] border-white/10 p-8 hover:border-primary/30 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-lg font-black text-white uppercase italic">{item.label}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
