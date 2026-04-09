import React, { useState } from 'react';
import { Calculator as CalcIcon } from 'lucide-react';

const Calculator = () => {
  const [mrp, setMrp] = useState('1000');
  const [cogs, setCogs] = useState('300');
  const [shipping, setShipping] = useState('100');
  const [marketing, setMarketing] = useState('200');

  const pMrp = Number(mrp) || 0;
  const pCogs = Number(cogs) || 0;
  const pShipping = Number(shipping) || 0;
  const pMarketing = Number(marketing) || 0;

  const netMargin = pMrp - (pCogs + pShipping + pMarketing);
  const marginPercentage = pMrp > 0 ? ((netMargin / pMrp) * 100).toFixed(1) : 0;

  return (
    <div className="container py-12">
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}><span className="text-accent">D2C Pricing</span> Calculator</h1>
        <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Input your unit economics to calculate net margins and ensure your pricing model is sustainable before scaling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="glass-panel flex-col gap-6">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalcIcon className="text-accent-cyan" /> Cost Inputs
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Selling Price (MRP) ₹</label>
            <input type="number" value={mrp} onChange={e => setMrp(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Cost of Goods Sold (COGS) ₹</label>
            <input type="number" value={cogs} onChange={e => setCogs(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Shipping & Packaging ₹</label>
            <input type="number" value={shipping} onChange={e => setShipping(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Customer Acquisition Cost (Marketing) ₹</label>
            <input type="number" value={marketing} onChange={e => setMarketing(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }} />
          </div>
        </div>

        <div className="glass-panel" style={{ background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>Unit Economics Summary</h3>
          
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Net Profit Per Unit</p>
            <p style={{ fontSize: '3.5rem', fontWeight: 'bold', color: netMargin > 0 ? '#10b981' : '#f43f5e' }}>
              ₹{netMargin}
            </p>
          </div>
          
          <div>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Profit Margin</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: isNaN(marginPercentage) ? 'white' : netMargin > 0 ? '#10b981' : '#f43f5e' }}>
              {isNaN(marginPercentage) ? '0' : marginPercentage}%
            </p>
          </div>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--glass-border)', textAlign: 'left' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'white' }}>Verdict:</h4>
            {netMargin > 0 ? (
               <p style={{ color: '#10b981', fontSize: '0.95rem' }}>Healthy margins! You have a sustainable model. Focus on scaling ad spend.</p>
            ) : (
               <p style={{ color: '#f43f5e', fontSize: '0.95rem' }}>Negative margins. You are losing money on every order. Increase MRP or optimize COGS/CAC before scaling.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
