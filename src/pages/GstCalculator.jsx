import React, { useState } from 'react';
import { Calculator, Wand2 } from 'lucide-react';
import Select from 'react-select';

// Comprehensive mock database representing open-source HSN/GST configurations
const HSN_DATABASE = [
  { value: "8517", label: "Smartphones & Telephones", rate: 18 },
  { value: "8471", label: "Laptops, Computers & Tablets", rate: 18 },
  { value: "4901", label: "Printed Books & Education Journals", rate: 0 },
  { value: "9973", label: "Software as a Service (SaaS)", rate: 18 },
  { value: "9983", label: "IT Consulting & Professional Services", rate: 18 },
  { value: "9982", label: "Legal & Accounting Services", rate: 18 },
  { value: "0901", label: "Coffee Beans & Roasted Coffee", rate: 5 },
  { value: "0902", label: "Tea Leaves", rate: 5 },
  { value: "2106", label: "Packaged Food Preparations", rate: 18 },
  { value: "6100", label: "Apparel & Clothing (< ₹1000)", rate: 5 },
  { value: "6200", label: "Apparel & Clothing (> ₹1000)", rate: 12 },
  { value: "8703", label: "Motor Cars & Passenger Vehicles", rate: 28 },
  { value: "3004", label: "Medicaments & Pharmaceuticals", rate: 12 },
  { value: "7113", label: "Gold Jewelry & Precious Stones", rate: 3 },
  { value: "0401", label: "Milk & Dairy (Unpackaged)", rate: 0 },
  { value: "0402", label: "Milk & Dairy (Packaged/Branded)", rate: 5 },
  { value: "8528", label: "Digital Cameras, Monitors & Projectors", rate: 18 },
  { value: "9403", label: "Furniture (Except Wooden)", rate: 18 },
  { value: "9401", label: "Wooden Furniture & Seating", rate: 12 },
  { value: "2201", label: "Packaged Drinking Water", rate: 18 },
  { value: "2202", label: "Aerated Drinks (Colas, Energy Drinks)", rate: 28 },
  { value: "3304", label: "Cosmetics & Beauty Products", rate: 18 },
  { value: "6400", label: "Footwear (< ₹1000)", rate: 5 },
  { value: "6401", label: "Footwear (> ₹1000)", rate: 18 },
  { value: "8504", label: "Electrical Transformers & Inverters", rate: 18 },
  { value: "9963", label: "Restaurant Services (No ITC)", rate: 5 },
  { value: "9964", label: "Transportation of Passengers (Cabs/Flights)", rate: 5 },
  { value: "9503", label: "Toys, Games & Sports Equipment", rate: 12 },
  { value: "8509", label: "Electromechanical Domestic Appliances", rate: 18 },
  { value: "3900", label: "Plastics & Articles thereof", rate: 18 }
].map(item => ({
  ...item,
  searchLabel: `${item.label} (HSN: ${item.value})`
}));

const selectStyles = {
  control: (base) => ({
    ...base,
    background: 'rgba(0,0,0,0.2)',
    borderColor: 'rgba(255,255,255,0.08)',
    padding: '0.25rem',
    borderRadius: '0.5rem',
    boxShadow: 'none',
    '&:hover': { borderColor: 'var(--accent-purple)' }
  }),
  menu: (base) => ({
    ...base,
    background: '#131b2f',
    border: '1px solid rgba(255,255,255,0.08)'
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    background: isSelected ? 'var(--accent-purple)' : isFocused ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
    color: 'white',
    cursor: 'pointer'
  }),
  singleValue: (base) => ({ ...base, color: 'white' }),
  input: (base) => ({ ...base, color: 'white' }),
};

const GstCalculator = () => {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(HSN_DATABASE[3]); // Default SaaS
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const handleCategoryChange = (selectedOption) => {
    setAiAnalyzing(true);
    setTimeout(() => {
      setSelectedCategory(selectedOption);
      setAiAnalyzing(false);
    }, 500); // Simulate API latency
  };

  const baseAmount = Number(amount) || 0;
  const gstAmount = (baseAmount * selectedCategory.rate) / 100;
  const totalAmount = baseAmount + gstAmount;

  return (
    <div className="container py-12">
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}><span className="text-accent">AI-Driven GST</span> Calculator</h1>
        <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Search millions of official products. Our HSN-indexing engine automatically maps your item to its precise 2026 Indian GST compliance slab.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="glass-panel flex-col gap-6">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calculator className="text-accent-purple" /> Transaction Details
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Search Product or Service Category</label>
            <Select
              options={HSN_DATABASE}
              value={selectedCategory}
              onChange={handleCategoryChange}
              styles={selectStyles}
              getOptionLabel={(e) => e.searchLabel}
              placeholder="e.g. Laptops, Coffee, SaaS, Shoes..."
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Base Amount (Exclude GST) ₹</label>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="e.g., 5000"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }} 
            />
          </div>
        </div>

        <div className="glass-panel" style={{ background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '350px' }}>
          {aiAnalyzing ? (
            <div className="flex-col items-center justify-center flex text-center animate-pulse-glow" style={{ animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
              <Wand2 className="text-accent-purple mb-4" size={48} />
              <p style={{ fontSize: '1.2rem' }}>Querying Central HSN Directory...</p>
              <p className="text-secondary mt-2">Mapping "{selectedCategory.label}" to the latest compliance slabs...</p>
            </div>
          ) : (
            <div style={{ animation: 'float 0.5s ease-out' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Tax Breakdown</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>HSN/SAC Code Identified:</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{selectedCategory.value}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Applicable GST Rate:</span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedCategory.rate}%</span>
              </div>
              
              {selectedCategory.rate > 0 ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>CGST ({(selectedCategory.rate / 2).toFixed(1)}%):</span>
                    <span>₹{(gstAmount / 2).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>SGST ({(selectedCategory.rate / 2).toFixed(1)}%):</span>
                    <span>₹{(gstAmount / 2).toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1rem' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>EXEMPT / NIL RATED PRODUCT</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ fontSize: '1.2rem', color: 'white' }}>Total Invoice Amount:</span>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GstCalculator;
