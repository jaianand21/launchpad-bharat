import React, { useState } from 'react';
import { ExternalLink, FileText, Search, Calculator, ArrowRight, ShieldCheck, CheckSquare, BookOpen, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import { resourceContentData } from '../utils/resourceContent';

const RESOURCES = [
  // Government Schemes
  { id: 1, title: "Startup India Registration", desc: "Official PDF guide to register under DPIIT and claim 3-year tax exemption.", category: "Govt Schemes", icon: <ShieldCheck size={24} /> },
  { id: 2, title: "Mudra Yojana Documentation", desc: "Bank-ready loan templates up to ₹10 Lakhs without collateral.", category: "Govt Schemes", icon: <ShieldCheck size={24} /> },
  { id: 3, title: "MSME Samadhaan Guide", desc: "Legal framework manual for recovering delayed payments from corporate clients.", category: "Govt Schemes", icon: <ShieldCheck size={24} /> },
  { id: 4, title: "Credit Guarantee Scheme (CGTMSE)", desc: "How to leverage Govt guarantees for unsecured funding.", category: "Govt Schemes", icon: <ShieldCheck size={24} /> },
  
  // Registration Guides
  { id: 5, title: "GST Registration Playbook", desc: "A definitive step-by-step handbook to secure your GSTIN legally.", category: "Registration", icon: <FileText size={24} /> },
  { id: 6, title: "IEC (Import Export Code)", desc: "Mandatory documentation flow for physical product cross-border shipping.", category: "Registration", icon: <FileText size={24} /> },
  { id: 7, title: "Private Limited vs. LLP", desc: "Comparative legal liability breakdown and incorporation process maps.", category: "Registration", icon: <FileText size={24} /> },
  
  // Checklists
  { id: 8, title: "Solo-Founder Readiness", desc: "Bootstrapped checklist: Bank accounts, domains, and fundamental IP protection.", category: "Checklists", icon: <CheckSquare size={24} /> },
  { id: 9, title: "Small Teams (Micro-Enterprise)", desc: "Co-founder equity splits, basic payroll compliance, and NDAs.", category: "Checklists", icon: <CheckSquare size={24} /> },
  { id: 10, title: "Growth-Stage Scaling", desc: "Series-A readiness checklist: Due diligence, ESOP structures, and cap tables.", category: "Checklists", icon: <CheckSquare size={24} /> },
  
  // Study Material
  { id: 11, title: "Annual Compliance Calendar", desc: "Due dates for IT returns, ROC filings, and Director KYC for 2024-25.", category: "Study Material", icon: <BookOpen size={24} /> },
  { id: 12, title: "Section 80-IAC Tax Relaxation", desc: "Deep dive into profit-linked deductions for recognized Indian Startups.", category: "Study Material", icon: <BookOpen size={24} /> },
  { id: 13, title: "Sector-Wise GST Rate Chart", desc: "Comprehensive appendix covering dynamic service and product slab rates.", category: "Study Material", icon: <BookOpen size={24} /> },
];

const CATEGORIES = ["All", "Govt Schemes", "Registration", "Checklists", "Study Material"];

const Resources = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [downloadingId, setDownloadingId] = useState(null);

  const filteredResources = RESOURCES.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || res.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || res.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const generateResourcePDF = (resObj) => {
    setDownloadingId(resObj.id);
    
    const content = resourceContentData[resObj.id] || {
      title: resObj.title,
      subtitle: "General Strategy Overview",
      sections: [{ heading: "Overview", text: resObj.desc }]
    };

    setTimeout(() => {
      const doc = new jsPDF();
      const M = 20, W = 170;
      let y = 20;

      const safe = (t) => String(t).replace(/[^\x00-\x7F]/g, c => ({ '₹': 'INR ' }[c] || ''));
      const chk = (n = 15) => { if (y + n > 275) { doc.addPage(); y = 20; } };

      // Header Block
      doc.setFillColor(15, 20, 35);
      doc.rect(0, 0, 210, 45, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 211, 238);
      doc.setFontSize(22);
      doc.text(safe(content.title), M, 25);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 220);
      doc.setFontSize(11);
      doc.text(safe(content.subtitle), M, 35);
      
      y = 60;

      content.sections.forEach((sec, idx) => {
        chk(30);
        
        // Section Badge
        doc.setFillColor(139, 92, 246);
        doc.circle(M + 3, y - 1, 4, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text(String(idx + 1), M + 2, y + 0.5);

        // Section Heading
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(14);
        doc.text(safe(sec.heading), M + 10, y + 1.5);
        y += 10;
        
        // Section Text
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(70, 70, 70);
        doc.setFontSize(10);
        const textLines = doc.splitTextToSize(safe(sec.text), W);
        
        textLines.forEach(line => {
          chk(7);
          doc.text(line, M, y);
          y += 6;
        });
        y += 8;
      });

      // Watermark Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(180, 180, 180);
        doc.text(`Official Launchpad Bharat Guide - Page ${i} of ${pageCount}`, M, 285);
      }

      doc.save(`Launchpad_Bharat_${resObj.id}_${content.title.replace(/\s+/g, '_')}.pdf`);
      setDownloadingId(null);
    }, 600);
  };

  return (
    <div className="container py-12">
      <div className="text-center mb-10">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Founders <span className="text-accent">Library</span></h1>
        <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          The ultimate vault for Indian entrepreneurs. Access critical compliance guides, legal checklists, and automated financial tools.
        </p>
      </div>

      {/* PRIORITY SECTIONS: INTERACTIVE CALCULATORS */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Interactive Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* D2C Pricing Calculator */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(34, 211, 238, 0.3)', background: 'linear-gradient(135deg, rgba(34,211,238,0.05), transparent)' }}>
          <div>
            <div className="flex items-center mb-4 text-accent-cyan">
              <DollarSign size={32} className="mr-3" />
              <h3 style={{ fontSize: '1.5rem' }}>D2C Price Calculator</h3>
            </div>
            <p className="text-secondary mb-6" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
              Reverse-engineer your unit economics. Input COGS, Marketing, and Shipping to calculate precise net margins and ensure profitability before running traffic.
            </p>
          </div>
          <button onClick={() => navigate('/calculator')} className="btn" style={{ width: '100%', padding: '1rem', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent-cyan)' }}>
            Launch Pricing Calculator <ArrowRight size={18} className="ml-2" />
          </button>
        </div>

        {/* AI-Driven GST Calculator */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(139, 92, 246, 0.3)', background: 'linear-gradient(135deg, rgba(139,92,246,0.05), transparent)' }}>
          <div>
            <div className="flex items-center mb-4 text-accent-purple">
              <Calculator size={32} className="mr-3" />
              <h3 style={{ fontSize: '1.5rem' }}>AI-Driven GST Calculator</h3>
            </div>
            <p className="text-secondary mb-6" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
              Select your product category and automatically fetch accurate HSN codes and composite CGST/SGST tax liabilities tailored for Indian regulations.
            </p>
          </div>
          <button onClick={() => navigate('/gst-calculator')} className="btn" style={{ width: '100%', padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}>
            Launch GST Engine <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>

      {/* SPONSORED MONETIZATION BLOCK (LEAD GEN) */}
      <div className="mb-12 glass-panel" style={{ width: '100%', maxWidth: '900px', margin: '0 auto 3rem', padding: '0', overflow: 'hidden', border: '1px solid rgba(34, 211, 238, 0.4)' }}>
        <div style={{ background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))', padding: '0.5rem 1rem', textAlign: 'center' }}>
          <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Sponsored / Verified Partner</span>
        </div>
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'rgba(0,0,0,0.4)' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white' }}>Need a Professional Startup Website Built?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', marginBottom: '2rem' }}>
            Skip the learning curve. Hire our certified Launchpad Bharat developers to build your entire website/app starting from just <strong style={{ color: 'var(--accent-cyan)' }}>₹1,000</strong>.
          </p>
          <a 
            href="https://wa.me/919358022343?text=Hi%20Launchpad%20Bharat,%20I%20am%20interested%20in%20getting%20a%20website%20built%20for%20my%20startup."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'linear-gradient(90deg, #10b981, #059669)' }}
          >
            Chat with Developers on WhatsApp
          </a>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Resource Vault</h2>

      {/* Search and Filters */}
      <div className="mb-8" style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex items-center" style={{ width: '100%', maxWidth: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.5rem 1rem', border: '1px solid var(--glass-border)' }}>
            <Search size={20} className="text-secondary mr-2" />
            <input 
              type="text" 
              placeholder="Search startup guides, legal pdfs, checklists..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '1rem' }}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'var(--accent-purple)' : 'transparent',
                border: `1px solid ${activeCategory === cat ? 'var(--accent-purple)' : 'var(--glass-border)'}`,
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.9rem'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <div key={res.id} className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div className="flex justify-between items-start mb-3">
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-purple)', borderRadius: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {res.category}
              </span>
              <div style={{ color: 'var(--text-secondary)' }}>
                {res.icon}
              </div>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{res.title}</h3>
            <p className="text-secondary mb-6" style={{ fontSize: '0.9rem', flex: 1, lineHeight: 1.5 }}>{res.desc}</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => generateResourcePDF(res)}
                disabled={downloadingId === res.id}
                className="btn btn-outline" 
                style={{ flex: 1, padding: '0.75rem', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {downloadingId === res.id ? 'Generating...' : <><FileText size={16} style={{ marginRight: '0.5rem' }} /> Download PDF</>}
              </button>
            </div>
          </div>
        ))}
        {filteredResources.length === 0 && (
          <div className="col-span-full text-center py-12 text-secondary">
            No resources match your search criteria. Try a different keyword.
          </div>
        )}
      </div>

    </div>
  );
};

export default Resources;
