import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getUsers(1, 20);
        setUsers(response.data.users || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch node operators');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBlockUser = async (userId) => {
    try {
      setActionLoading(userId);
      await adminAPI.blockUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBlocked: true } : u))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Block sequence failure');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      setActionLoading(userId);
      await adminAPI.unblockUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBlocked: false } : u))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Unblock sequence failure');
    } finally {
      setActionLoading(null);
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
              User <span className="text-primary glow-text">Directory</span>
            </h1>
            <p className="text-muted-foreground font-medium">Access levels and identity management for all network entities.</p>
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-8" />}

        <div className="cyber-glass rounded-[3rem] border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Identity</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Protocol</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Access Role</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Network Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-black text-primary border border-primary/20 uppercase">
                          {user.name?.[0] || '?'}
                        </div>
                        <span className="font-bold text-white uppercase italic text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-sm font-mono text-muted-foreground">{user.email}</td>
                    <td className="px-10 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-[0.2em] uppercase border ${
                        user.role === 'admin' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-primary/10 text-primary border-primary/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      {user.isBlocked ? (
                        <span className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                          <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                          Terminated
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-secondary text-[10px] font-black uppercase tracking-widest">
                          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-10 py-6 text-right">
                      {user.isBlocked ? (
                        <button
                          onClick={() => handleUnblockUser(user._id)}
                          disabled={actionLoading === user._id}
                          className="px-6 py-2 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all disabled:opacity-50"
                        >
                          {actionLoading === user._id ? 'SYNC...' : 'Reactivate'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlockUser(user._id)}
                          disabled={actionLoading === user._id || user.role === 'admin'}
                          className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {actionLoading === user._id ? 'SYNC...' : 'Terminate'}
                        </button>
                      )}
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
