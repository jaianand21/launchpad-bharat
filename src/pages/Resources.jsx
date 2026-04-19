import React, { useState } from 'react';
import { ExternalLink, FileText, Search, Calculator, ArrowRight, ShieldCheck, CheckSquare, BookOpen, DollarSign, Eye, X, Download, Star, Zap, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import { resourceContentData } from '../utils/resourceContent';
import { RESOURCES, INTENTS, STAGES, TYPES, PRIORITIES } from '../data/resourcesData';

const Resources = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIntent, setActiveIntent] = useState("All Needs");
  const [activeStage, setActiveStage] = useState("All Stages");
  const [activeType, setActiveType] = useState("All Types");
  const [activePriority, setActivePriority] = useState("All Priorities");
  const [downloadingId, setDownloadingId] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  // Dynamic Highlight Sections
  const mostUsedResources = RESOURCES.filter(r => r.mostUsed).slice(0, 3);
  const quickStartPack = RESOURCES.filter(r => r.priority === "Beginner" && r.intent === "Start a Startup").slice(0, 3);
  const costlyMistakes = RESOURCES.filter(r => r.intent === "Stay Compliant" && r.priority === "Critical").slice(0, 3);

  const filteredResources = RESOURCES.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || res.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIntent = activeIntent === "All Needs" || res.intent === activeIntent;
    const matchesStage = activeStage === "All Stages" || res.stage === activeStage;
    const matchesType = activeType === "All Types" || res.companyType === activeType || res.companyType === "All Types";
    const matchesPriority = activePriority === "All Priorities" || res.priority === activePriority;
    
    return matchesSearch && matchesIntent && matchesStage && matchesType && matchesPriority;
  });

  const generateResourcePDF = (resObj, action = 'preview') => {
    setDownloadingId(resObj.id);
    
    const content = resourceContentData[resObj.id] || {
      title: resObj.title,
      subtitle: "General Strategy Overview",
      sections: [{ heading: "Overview", text: "Summary content arriving soon..." }]
    };

    setTimeout(() => {
      const doc = new jsPDF();
      const M = 20, W = 170;
      let y = 20;

      const safe = (t) => String(t).replace(/[^\x00-\x7F]/g, c => ({ '₹': 'INR ' }[c] || ''));
      const chk = (n = 15) => { if (y + n > 275) { doc.addPage(); y = 20; } };

      // --- 1. COVER PAGE ---
      doc.setFillColor(15, 20, 35);
      doc.rect(0, 0, 210, 297, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      const titleText = safe(content.title);
      const titleLines = doc.splitTextToSize(titleText, 170);
      doc.text(titleLines, 105, 120, { align: 'center' });
      
      const nextY = 120 + (titleLines.length * 12);
      
      doc.setFontSize(16);
      doc.setTextColor(34, 211, 238);
      doc.text("Launchpad Bharat", 105, nextY + 10, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 220);
      const specificFounder = user?.name ? user.name : 'Founder';
      doc.text(`Prepared exclusively for: ${safe(specificFounder)}`, 105, nextY + 25, { align: 'center' });

      // --- 2. CONTENT PAGES ---
      doc.addPage();
      
      doc.setFillColor(15, 20, 35);
      doc.rect(0, 0, 210, 45, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 211, 238);
      doc.setFontSize(22);
      
      const smallTitleLines = doc.splitTextToSize(titleText, 170);
      doc.text(smallTitleLines[0] + (smallTitleLines.length > 1 ? '...' : ''), M, 25);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 220);
      doc.setFontSize(11);
      doc.text(safe(content.subtitle), M, 35);
      
      y = 60;

      content.sections.forEach((sec, idx) => {
        chk(30);
        
        doc.setFillColor(139, 92, 246);
        doc.circle(M + 3, y - 1, 4, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text(String(idx + 1), M + 2, y + 0.5);

        doc.setTextColor(30, 30, 30);
        doc.setFontSize(14);
        doc.text(safe(sec.heading), M + 10, y + 1.5);
        y += 10;
        
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

      // --- 3. LAST PAGE (CTA) ---
      doc.addPage();
      doc.setFillColor(15, 20, 35);
      doc.rect(0, 0, 210, 297, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text("Launchpad Bharat", 105, 100, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 220);
      doc.text("Join Our Free Startup Community on WhatsApp:", 105, 120, { align: 'center' });

      doc.setTextColor(34, 211, 238);
      const communityUrl = "https://chat.whatsapp.com/Ey4FCxCjL9x9fH698xNnkO";
      
      if (typeof doc.textWithLink === 'function') {
        doc.textWithLink(communityUrl, 105, 130, { url: communityUrl, align: 'center' });
      } else {
        doc.text(communityUrl, 105, 130, { align: 'center' });
        const textWidth = doc.getStringUnitWidth(communityUrl) * 14 / doc.internal.scaleFactor;
        doc.link(105 - (textWidth/2), 125, textWidth, 8, { url: communityUrl });
      }

      doc.setTextColor(255, 255, 255);
      doc.text("Need more guidance about startups and documentation?", 105, 155, { align: 'center' });
      doc.text("Contact us directly:", 105, 165, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 211, 238);
      doc.setFontSize(18);
      doc.text("+91 93580 22343", 105, 180, { align: 'center' });

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        if (i === 1 || i === pageCount) {
          doc.setTextColor(150, 150, 150);
        } else {
          doc.setTextColor(180, 180, 180);
        }
        doc.text(`Official Launchpad Bharat Guide - Page ${i} of ${pageCount}`, M, 285);
      }

      if (action === 'preview') {
        setPreviewData({ url: doc.output('datauristring'), title: resObj.title, resObj });
      } else {
        doc.save(`Launchpad_Bharat_${resObj.id}_${content.title.replace(/\s+/g, '_')}.pdf`);
      }
      setDownloadingId(null);
    }, 600);
  };

  const renderResourceCard = (res) => (
    <div key={res.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', cursor: 'default' }}>
      <div className="flex justify-between items-start mb-4">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.70rem', padding: '0.25rem 0.6rem', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-purple)', borderRadius: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {res.intent}
          </span>
          <span style={{ fontSize: '0.70rem', padding: '0.25rem 0.6rem', background: 'rgba(34, 211, 238, 0.15)', color: 'var(--accent-cyan)', borderRadius: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {res.timeToUse}
          </span>
          {res.priority === "Critical" && (
            <span style={{ fontSize: '0.70rem', padding: '0.25rem 0.6rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderRadius: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Critical
            </span>
          )}
          {res.priority === "Beginner" && (
            <span style={{ fontSize: '0.70rem', padding: '0.25rem 0.6rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Beginner
            </span>
          )}
        </div>
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <span style={{ color: 'var(--accent-cyan)', marginTop: '0.1rem' }}>{res.icon}</span> {res.title}
      </h3>
      <p className="text-secondary mb-6" style={{ fontSize: '0.9rem', flex: 1, lineHeight: 1.5 }}>{res.desc}</p>
      
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button 
          onClick={() => generateResourcePDF(res, 'preview')}
          disabled={downloadingId === res.id}
          className="btn btn-outline" 
          style={{ flex: 1, padding: '0.75rem', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {downloadingId === res.id ? 'Loading...' : <><Eye size={16} style={{ marginRight: '0.5rem' }} /> Preview</>}
        </button>
        <button 
          onClick={() => generateResourcePDF(res, 'download')}
          disabled={downloadingId === res.id}
          className="btn btn-primary" 
          style={{ flex: 1, padding: '0.75rem', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--accent-purple)', borderColor: 'var(--accent-purple)' }}
        >
          <Download size={16} style={{ marginRight: '0.5rem' }} /> Save PDF
        </button>
      </div>
    </div>
  );

  return (
    <div className="container py-12">
      <div className="text-center mb-10">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Founders <span className="text-accent">Library</span></h1>
        <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Stop guessing. Execute rapidly with our highly-curated problem-solving frameworks and document templates.
        </p>
      </div>

      {/* HIGHLIGHTED BUNDLES */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', color: 'white' }}>Quick Action Bundles</h2>
      
      <div className="mb-12" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Avoid Costly Mistakes Section */}
        {costlyMistakes.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), transparent)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.5rem', borderRadius: '1rem' }}>
            <h3 className="flex items-center" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#ef4444', fontWeight: 600 }}>
              <AlertTriangle className="mr-2" size={24} /> Avoid Costly Mistakes (Compliance Critical)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {costlyMistakes.map(renderResourceCard)}
            </div>
          </div>
        )}

        {/* Quick Start Pack Section */}
        {quickStartPack.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.05), transparent)', border: '1px solid rgba(34, 211, 238, 0.2)', padding: '1.5rem', borderRadius: '1rem' }}>
            <h3 className="flex items-center" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              <Zap className="mr-2" size={24} /> Quick Start Pack (For Beginners)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickStartPack.map(renderResourceCard)}
            </div>
          </div>
        )}

        {/* Most Used Section */}
        {mostUsedResources.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), transparent)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '1.5rem', borderRadius: '1rem' }}>
            <h3 className="flex items-center" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-purple)', fontWeight: 600 }}>
              <Star className="mr-2" size={24} /> Top Downloaded By Indian Founders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mostUsedResources.map(renderResourceCard)}
            </div>
          </div>
        )}
      </div>

      {/* FILTERABLE RESOURCE VAULT */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginTop: '2rem' }}>Resource Database</h2>
      <div className="mb-8" style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
        <div className="flex items-center mb-6" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.75rem 1rem', border: '1px solid var(--glass-border)' }}>
          <Search size={20} className="text-secondary mr-3" />
          <input 
            type="text" 
            placeholder="Search problems, guides, legal pdfs, checklists..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '1rem' }}
          />
        </div>
        
        <div className="mb-5">
          <p className="text-sm text-secondary mb-3 uppercase tracking-wider font-semibold">What are you trying to accomplish?</p>
          <div className="flex flex-wrap gap-2">
            {INTENTS.map(intent => (
              <button 
                key={intent} 
                onClick={() => setActiveIntent(intent)}
                style={{
                  background: activeIntent === intent ? 'var(--accent-purple)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${activeIntent === intent ? 'var(--accent-purple)' : 'var(--glass-border)'}`,
                  color: activeIntent === intent ? 'white' : 'var(--text-secondary)',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem',
                  fontWeight: activeIntent === intent ? '600' : '400'
                }}
              >
                {intent}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-secondary mb-3 uppercase tracking-wider font-semibold">Priority Level:</p>
            <select 
              value={activePriority} 
              onChange={(e) => setActivePriority(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
            >
              {PRIORITIES.map(p => <option key={p} value={p} style={{ background: '#111827' }}>{p}</option>)}
            </select>
          </div>
          <div>
            <p className="text-sm text-secondary mb-3 uppercase tracking-wider font-semibold">Company Stage:</p>
            <select 
              value={activeStage} 
              onChange={(e) => setActiveStage(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
            >
              {STAGES.map(s => <option key={s} value={s} style={{ background: '#111827' }}>{s}</option>)}
            </select>
          </div>
          <div>
            <p className="text-sm text-secondary mb-3 uppercase tracking-wider font-semibold">Business Model:</p>
            <select 
              value={activeType} 
              onChange={(e) => setActiveType(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
            >
              {TYPES.map(t => <option key={t} value={t} style={{ background: '#111827' }}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(renderResourceCard)}
        {filteredResources.length === 0 && (
          <div className="col-span-full text-center py-12" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px dashed var(--glass-border)' }}>
            <p className="text-secondary mb-2">No documents match your exact problem profile.</p>
            <button onClick={() => { setSearchTerm(""); setActiveIntent("All Needs"); setActiveStage("All Stages"); setActiveType("All Types"); setActivePriority("All Priorities"); }} className="text-accent-cyan underline">Clear all filters</button>
          </div>
        )}
      </div>

      {/* PREVIEW MODAL */}
      {previewData && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', backdropFilter: 'blur(5px)' }}>
          
          <div style={{ padding: '1rem 2rem', background: 'rgba(20, 25, 40, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>Previewing Resource: <span style={{ color: 'var(--accent-cyan)', fontWeight: '400' }}>{previewData.title}</span></h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => generateResourcePDF(previewData.resObj, 'download')}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1.25rem', background: 'var(--accent-purple)', borderColor: 'var(--accent-purple)' }}
              >
                <Download size={18} style={{ marginRight: '0.5rem' }} /> Save PDF
              </button>
              <button 
                onClick={() => setPreviewData(null)}
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <iframe 
              src={`${previewData.url}#toolbar=0`} 
              style={{ width: '100%', maxWidth: '900px', height: '100%', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', background: 'transparent' }}
              title="PDF Preview"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Resources;
