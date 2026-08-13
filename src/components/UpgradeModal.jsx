import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Sparkles, Shield, Smartphone } from 'lucide-react';
import { PREMIUM_PRICE_LABEL, PREMIUM_PRICE_INR } from '../config/pricing';
import { useAuth } from '../context/AuthContext';

const UpgradeModal = ({ isOpen, onClose, onSuccess, context = 'blueprint' }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    setLoading(true);
    setErrorMsg('');
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      // In development mode (where VITE_API_URL might be local or in non-prod), we bypass real Razorpay
      const isProduction = import.meta.env.PROD || import.meta.env.VITE_NODE_ENV === 'production';

      if (!isProduction) {
        // Dev Mode: Direct upgrade call with dummy details
        console.log('[UPGRADE] Running in Development Mode. Simulating Razorpay upgrade.');
        const res = await fetch(`${apiBase}/api/user/upgrade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            razorpay_order_id: 'dev_order_123',
            razorpay_payment_id: 'dev_pay_123',
            razorpay_signature: 'dev_sig_123'
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Direct upgrade simulation failed');
        }

        const data = await res.json();
        if (data.success) {
          onSuccess(data);
          onClose();
          return;
        }
      }

      // Prod Mode: Load Razorpay SDK and open checkout sheet
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
      }

      // 1. Create order on the backend if needed, or open Razorpay with standard pricing
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mockkey',
        amount: Number(PREMIUM_PRICE_INR) * 100, // in paise
        currency: 'INR',
        name: 'Launchpad Bharat',
        description: 'Premium Startup Architect Subscription',
        image: '/favicon.png',
        handler: async function (response) {
          try {
            setLoading(true);
            const res = await fetch(`${apiBase}/api/user/upgrade`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || 'order_direct_charge',
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!res.ok) {
              const errData = await res.json();
              throw new Error(errData.error || 'Failed to verify payment with backend');
            }

            const data = await res.json();
            if (data.success) {
              onSuccess(data);
              onClose();
            } else {
              throw new Error('Upgrade verification failed.');
            }
          } catch (verifyErr) {
            console.error('[Verify Upgrade Error]', verifyErr);
            setErrorMsg(verifyErr.message || 'Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.mobile_number || ''
        },
        theme: {
          color: '#7c5cfc'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('[Razorpay Upgrade Flow Error]', err);
      setErrorMsg(err.message || 'Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 3, 15, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '460px',
              background: 'linear-gradient(135deg, rgba(17, 12, 36, 0.95), rgba(28, 20, 60, 0.95))',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '1.25rem',
              padding: '2rem 1.75rem',
              boxShadow: '0 20px 50px rgba(124, 92, 252, 0.25)',
              zIndex: 1001,
              color: 'white',
              textAlign: 'center',
              overflow: 'hidden'
            }}
          >
            {/* Top decorative glow */}
            <div style={{
              position: 'absolute',
              top: '-30%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '180px',
              height: '180px',
              background: 'radial-gradient(circle, rgba(124, 92, 252, 0.3) 0%, rgba(124, 92, 252, 0) 70%)',
              pointerEvents: 'none'
            }} />

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyinit: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s',
                zIndex: 2
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              <X size={16} />
            </button>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #7c5cfc, #3bd3ec)',
                borderRadius: '50%',
                margin: '0 auto 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(124, 92, 252, 0.4)'
              }}>
                <Zap size={28} fill="white" color="white" />
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                Upgrade to <span style={{ color: 'var(--accent-purple)' }}>Premium</span>
              </h2>

              <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {context === 'chat' 
                  ? "You've used all 5 free chat messages. Upgrade to keep talking to your AI Architect."
                  : "You've reached your free monthly blueprint limit. Upgrade to unlock unlimited generations."
                }
              </p>

              {/* Benefits checklist */}
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '0.75rem',
                padding: '1.15rem 1.25rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.75rem',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                {[
                  "Unlimited AI Blueprint Generations",
                  "Unlimited Chat with AI Architect",
                  "Detailed 18-Page PDF Download",
                  "GST & Legal Compliance Help"
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'rgba(34, 211, 238, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                      flexShrink: 0
                    }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Price Banner */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium Access</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#3bd3ec' }}>{PREMIUM_PRICE_LABEL}</p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Cancel anytime · No hidden charges</p>
              </div>

              {errorMsg && (
                <p style={{ fontSize: '0.8rem', color: '#f43f5e', marginBottom: '1rem', background: 'rgba(244, 63, 94, 0.1)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                  {errorMsg}
                </p>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.95rem',
                    background: 'linear-gradient(135deg, #7c5cfc, #6366f1)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(124, 92, 252, 0.35)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={e => { if(!loading) e.currentTarget.style.boxShadow = '0 6px 24px rgba(124, 92, 252, 0.5)'; }}
                  onMouseLeave={e => { if(!loading) e.currentTarget.style.boxShadow = '0 4px 18px rgba(124, 92, 252, 0.35)'; }}
                >
                  {loading ? 'Processing Payment...' : (
                    <>
                      <Sparkles size={18} />
                      Upgrade to Premium Now
                    </>
                  )}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
                  <Shield size={12} />
                  <span>Secured by Razorpay</span>
                </div>

                <div style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Need help or alternative payment?</span>
                  <a
                    href="https://wa.me/919358022343?text=Hi!%20I%20want%20to%20upgrade%20my%20Launchpad%20Bharat%20plan%20to%20Premium%20but%20need%20help."
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.78rem',
                      color: '#25d366',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    <Smartphone size={13} />
                    WhatsApp Support (+91 93580 22343)
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;
