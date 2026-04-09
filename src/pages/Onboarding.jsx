import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target, Compass, Briefcase } from 'lucide-react';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    business_stage: '',
    business_type: '',
    goal: ''
  });
  const [loading, setLoading] = useState(false);
  const { onboardUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await onboardUser(formData);
    if (result.success) {
      window.location.href = '/'; // Hard redirect to force state reload safely
    } else {
      alert("Failed to save onboarding data.");
      setLoading(false);
    }
  };

  return (
    <div className="container py-20 flex justify-center items-center" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>Complete Your Profile</h2>
          <p className="text-secondary">Before entering the Founder Library, we need to personalize your experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              <Compass size={18} className="text-accent-purple" /> What is your current business stage?
            </label>
            <select required value={formData.business_stage} onChange={e => setFormData({...formData, business_stage: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '0.5rem', outline: 'none' }}>
              <option value="" disabled>Select Stage</option>
              <option value="idea">Just an Idea</option>
              <option value="validation">Validating / Prototyping</option>
              <option value="registered">Registered & Building</option>
              <option value="scaling">Revenue / Scaling</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              <Briefcase size={18} className="text-accent-cyan" /> What type of business are you building?
            </label>
            <select required value={formData.business_type} onChange={e => setFormData({...formData, business_type: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '0.5rem', outline: 'none' }}>
              <option value="" disabled>Select Type</option>
              <option value="service">Service Agency / Consulting</option>
              <option value="product">Physical Product / D2C</option>
              <option value="tech">Tech / SaaS / Platform</option>
              <option value="local">Local Retail / Offline</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              <Target size={18} className="text-accent-coral" /> What is your primary immediate goal?
            </label>
            <select required value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '0.5rem', outline: 'none' }}>
              <option value="" disabled>Select Goal</option>
              <option value="idea">Finding a solid, viable idea</option>
              <option value="funding">Getting Grants / Loans / Funding</option>
              <option value="growth">Customer Acquisition & Growth</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary mt-4" style={{ padding: '1rem', width: '100%' }} disabled={loading}>
            {loading ? 'Saving...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
