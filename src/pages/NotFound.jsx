import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-20 flex flex-col items-center justify-center text-center" style={{ minHeight: '80vh' }}>
      <div 
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(34, 211, 238, 0.2))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        className="animate-float"
      >
        <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-purple)' }}>404</span>
      </div>
      
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Page <span className="text-accent">Not Found</span></h1>
      <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '500px', marginBottom: '2.5rem', lineHeight: 1.6 }}>
        Looks like you've wandered into an uncharted domain. Let's get you back to building your startup.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-outline" 
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Go Back
        </button>
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Home size={18} style={{ marginRight: '0.5rem' }} /> Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
