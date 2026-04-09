import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Loader, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [stats, setStats] = useState({ totalDocs: 0, latestCheck: 'N/A' });

  useEffect(() => {
    fetch('http://localhost:5000/api/documents')
      .then(res => res.json())
      .then(data => {
        setStats({
          totalDocs: data.length,
          latestCheck: data[0]?.last_checked_at ? new Date(data[0].last_checked_at).toLocaleString() : 'Never'
        });
      })
      .catch(err => console.error("Admin stats fetch failed", err));
  }, [loading]); // refresh stats when loading finishes

  const forceDocumentSync = async () => {
    setLoading(true);
    setSuccessMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/documents/sync', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Government HTTP Verification Cycle Queued & Executed.');
      }
    } catch(err) {
      console.error(err);
      setSuccessMsg('HTTP Error: Node.js server unreachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="mb-10 flex items-center gap-3">
        <ShieldAlert size={32} className="text-accent-coral" />
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>System <span className="text-accent-coral">Administration</span></h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Document Sync Card */}
        <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(244, 63, 94, 0.3)', background: 'linear-gradient(135deg, rgba(244,63,94,0.05), transparent)' }}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white', display: 'flex', alignItems: 'center' }}>
                <Database className="mr-2 text-accent-coral" /> Content Pipeline Engine
              </h2>
              <p className="text-secondary mb-2" style={{ fontSize: '0.9rem' }}>
                Manage the live HTTP scraping links synchronizing the Founders Library against official Govt servers.
              </p>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-secondary">Monitored Documents:</span>
              <span style={{ color: 'white', fontWeight: 'bold' }}>{stats.totalDocs} Vaults</span>
            </div>
            <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
              <span className="text-secondary">Last verification sweep:</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{stats.latestCheck}</span>
            </div>
          </div>

          {successMsg && (
             <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(34, 211, 238, 0.3)', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={16} className="mr-2" style={{ marginRight: '0.5rem' }} /> {successMsg}
             </div>
          )}

          <button 
             onClick={forceDocumentSync}
             disabled={loading}
             className="btn" 
             style={{ width: '100%', padding: '1rem', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-coral)', borderColor: 'rgba(244, 63, 94, 0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {loading ? <Loader className="animate-spin mr-2" /> : <RefreshCw className="mr-2" />}
            {loading ? 'Executing Target Sweep...' : 'Force Manual Govt Server Sync'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
