import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Wand2, Download, FileText, ThumbsUp, ThumbsDown, Bookmark, Smartphone, CheckCircle2, AlertTriangle, Star } from 'lucide-react';
import CreatableSelect from 'react-select/creatable';
import { jsPDF } from 'jspdf';
import { useAuth } from '../context/AuthContext';

const SKILLS = [
  "Web Development", "UI/UX Design", "Digital Marketing", "AI/ML", "Sales & Negotiation",
  "Content Writing", "Copywriting", "SEO Optimization", "Social Media Management", "Graphic Design",
  "Video Editing", "Data Analysis", "Python Programming", "React Development", "App Development",
  "E-commerce Arbitrage", "Dropshipping", "Accounting & Finance", "Business Strategy", "Supply Chain Management",
  "B2B Lead Generation", "Public Relations", "Event Management", "Customer Success", "Technical Support",
  "Cybersecurity", "Blockchain Development", "SaaS Architecture", "No-Code Development", "Prompt Engineering",
  "Email Marketing", "Performance Marketing", "Photography", "Podcasting", "Animation",
  "Product Management", "Quality Assurance", "Agile/Scrum", "HR & Recruiting", "Legal/Compliance",
  "Virtual Assistance", "Audio Production", "Language Translation", "Nutrition & Fitness", "Real Estate Brokering",
  "Stock Trading", "Logistics", "Local Retail Management", "Influencer Management", "Community Building"
].map(s => ({ value: s, label: s }));

const NICHES = [
  "E-commerce", "Healthcare", "SaaS", "EdTech", "Real Estate",
  "Small Businesses", "D2C Brands", "AgriTech", "FinTech", "Creator Economy",
  "Logistics & Delivery", "Green Tech", "Gaming & E-sports", "Food & Beverage"
].map(n => ({ value: n, label: n }));

const selectStyles = {
  control: (base) => ({ ...base, background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.08)', padding: '0.25rem', borderRadius: '0.5rem', boxShadow: 'none', '&:hover': { borderColor: 'var(--accent-purple)' } }),
  menu: (base) => ({ ...base, background: '#131b2f', border: '1px solid rgba(255,255,255,0.08)' }),
  option: (base, { isFocused, isSelected }) => ({ ...base, background: isSelected ? 'var(--accent-purple)' : isFocused ? 'rgba(139, 92, 246, 0.2)' : 'transparent', color: 'white', cursor: 'pointer' }),
  multiValue: (base) => ({ ...base, background: 'rgba(139, 92, 246, 0.3)', borderRadius: '0.25rem' }),
  multiValueLabel: (base) => ({ ...base, color: 'white' }),
  multiValueRemove: (base) => ({ ...base, color: 'white', '&:hover': { background: 'rgba(244, 63, 94, 0.5)' } }),
  input: (base) => ({ ...base, color: 'white' }),
  singleValue: (base) => ({ ...base, color: 'white' }),
  placeholder: (base) => ({ ...base, color: 'rgba(255,255,255,0.3)' }),
};

// ─── Star Rating Component ─────────────────────────────────────────────────
const StarRating = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '0.25rem' }}>
    {[1, 2, 3, 4, 5].map(n => (
      <button key={n} onClick={() => onChange(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.15rem' }}>
        <Star size={22} fill={n <= value ? '#f59e0b' : 'none'} color={n <= value ? '#f59e0b' : 'rgba(255,255,255,0.2)'} />
      </button>
    ))}
  </div>
);

// ─── Section Card Component ────────────────────────────────────────────────
const Section = ({ title, color = '#8b5cf6', children }) => (
  <div style={{ padding: '1.25rem', background: `${color}08`, border: `1px solid ${color}33`, borderRadius: '0.75rem' }}>
    <p style={{ fontWeight: 700, color, fontSize: '0.85rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
    {children}
  </div>
);

const Body = ({ children }) => (
  <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{children}</p>
);

const KVRow = ({ label, value }) => (
  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, minWidth: '110px' }}>{label}:</span>
    <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{value}</span>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
const AIGenerators = () => {
  const { user } = useAuth();
  const userName = user?.name || 'Founder';
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [budget, setBudget] = useState('');
  const [rejectedNames, setRejectedNames] = useState([]);
  const [rating, setRating] = useState(0);
  const [savedBlueprints, setSavedBlueprints] = useState(() => {
    try { return JSON.parse(localStorage.getItem('saved_blueprints') || '[]'); } catch { return []; }
  });
  const [showSaved, setShowSaved] = useState(false);

  // Chat states
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Welcome, ${userName}! I'm your Startup Architect. Describe your idea, your skills, and your budget — and I'll build a brutally honest blueprint. No fluff.` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const resultRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Warm-up ping: wake the Render backend on page load to avoid cold-start timeout
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${apiBase}/health`).catch(() => {}); // Silent — just wakes up the server
  }, []);

  // Initial load logic for Scroll to top + URL Cart logic
  useEffect(() => {
    window.scrollTo(0, 0);
    if (searchParams.get('saved') === 'true' && savedBlueprints.length > 0) {
      setShowSaved(true);
      setSearchParams({});
    }
  }, [searchParams, savedBlueprints.length, setSearchParams]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMessages = [...messages, { role: 'user', text: chatInput }];
    setMessages(newMessages);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = 'Interesting angle. What is your starting capital (in INR) and your primary skill set? That determines whether this idea is viable or needs a pivot.';
      if (/\d{3,}/.test(chatInput)) reply = `Got the budget figure. Now — what is your primary skill? Web Dev, Marketing, Operations? That shapes how I build the execution strategy for you.`;
      else if (/skill|dev|design|market/i.test(chatInput)) reply = `Noted the skills. You can hit "Generate Blueprint from Chat" now, or keep refining. I need your INR budget to validate feasibility.`;
      setMessages([...newMessages, { role: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  const runGenerate = async (rejected = rejectedNames) => {
    if (selectedSkills.length === 0 || selectedNiches.length === 0 || !budget) {
      alert('Please fill in Skills, Niche, and Starting Budget before generating.');
      return;
    }
    
    setLoading(true);
    setResult(null);
    setRating(0);

    const skillsStr = selectedSkills.map(s => s.label).join(', ');
    const nichesStr = selectedNiches.map(n => n.label).join(', ');


    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/generate-blueprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: skillsStr,
          niches: nichesStr,
          budget: budget,
          userName: user?.name || 'Anonymous Founder',
          userEmail: user?.email || 'N/A'
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate blueprint');
      }

      const blueprintData = await response.json();
      
      const finalResult = {
        ...blueprintData,
        budget: Number(budget),
        skillList: skillsStr,
        niche: nichesStr
      };

      setResult(finalResult);
      // Scroll to result
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    } catch (err) {
      console.error('[GENERATE] Error:', err.message);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (!result) return;
    const entry = { ...result, savedAt: new Date().toISOString(), rating };
    const updated = [entry, ...savedBlueprints.filter(b => b.startup_name !== result.startup_name)];
    setSavedBlueprints(updated);
    localStorage.setItem('saved_blueprints', JSON.stringify(updated));
    alert(`"${result.startup_name}" saved to your Saved Blueprints!`);
  };

  const handleDislike = () => {
    if (!result) return;
    const newRejected = [...rejectedNames, result.startup_name];
    setRejectedNames(newRejected);
    runGenerate(newRejected);
  };

  const generateFromChat = () => {
    if (!budget) setBudget('15000');
    if (selectedNiches.length === 0) setSelectedNiches([{ label: 'E-commerce', value: 'E-commerce' }]);
    if (selectedSkills.length === 0) setSelectedSkills([{ label: 'Web Development', value: 'Web Development' }]);
    runGenerate(rejectedNames);
  };

  // ── PDF Download (18 pages) ──────────────────────────────────────────────
  const generatePDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    const M = 20, W = 170;
    let y = 20;

    const safe = (t) => String(t || '').replace(/[^\x00-\x7F]/g, c =>
      ({ '₹': 'INR ', '✅': '[OK]', '⚠️': '[!]', '❌': '[X]' }[c] || ''));

    const chk = (n = 12) => { if (y + n > 275) { doc.addPage(); y = 22; } };

    const hdg = (text, color = [139, 92, 246]) => {
      chk(20); 
      y += 5;
      doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(...color);
      doc.text(safe(text), M, y); y += 4;
      doc.setDrawColor(...color); doc.setLineWidth(0.5); doc.line(M, y, M + W, y); y += 10;
    };

    const bdy = (text, size = 10, bold = false, color = [40, 40, 40]) => {
      chk(size + 5); 
      doc.setFontSize(size); doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(safe(text), W);
      lines.forEach(l => { 
        chk(size + 2); 
        doc.text(l, M, y); 
        y += size >= 13 ? 8 : 6; 
      });
      y += 4;
    };

    const r = result;

    // PAGE 1: COVER
    doc.setFillColor(12, 12, 32); doc.rect(0, 0, 210, 297, 'F');
    doc.setFillColor(34, 211, 238); doc.rect(0, 0, 6, 297, 'F');
    
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(34, 211, 238);
    doc.text('LAUNCHPAD BHARAT', M, 38);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 160);
    doc.text("Official Startup Blueprint & Strategy Report", M, 46);
    
    doc.setFontSize(32); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    const nameL = doc.splitTextToSize(r.startup_name || r.name || 'Startup', W);
    nameL.forEach((l, i) => doc.text(l, M, 80 + i * 14));
    
    let curY = 80 + nameL.length * 14 + 8;
    doc.setFontSize(14); doc.setFont('helvetica', 'italic'); doc.setTextColor(34, 211, 238);
    doc.splitTextToSize(safe(r.tagline || ''), W).forEach(l => { doc.text(l, M, curY); curY += 7; });
    
    curY += 15;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(160, 160, 200);
    doc.text('Niche: ' + (r.niche || ''), M, curY);
    doc.text('Capital: INR ' + (r.budget || 0).toLocaleString('en-IN'), M, curY + 10);
    doc.text('Founder: ' + userName, M, curY + 20);
    doc.text('Date: ' + new Date().toLocaleDateString('en-IN'), M, curY + 30);
    if (r.foreign_inspiration) {
      curY += 45;
      doc.setFontSize(9); doc.setTextColor(139, 92, 246);
      doc.text('Inspired by: ' + safe(r.foreign_inspiration.company) + ' (' + safe(r.foreign_inspiration.country) + ')', M, curY);
    }

    // PAGE 2: THE PROBLEM
    doc.addPage(); y = 30;
    hdg('1. THE PROBLEM');
    bdy(r.problem_statement || '', 11);

    // PAGE 3: THE SOLUTION + INDIAN ADAPTATION
    doc.addPage(); y = 30;
    hdg('2. THE SOLUTION');
    bdy(r.solution || '', 11);
    
    if (r.indian_adaptation) {
      y += 5;
      hdg('3. INDIAN MARKET ADAPTATION', [34, 211, 238]);
      bdy('Distribution: ' + (r.indian_adaptation.distribution || ''), 10);
      bdy('Trust Building: ' + (r.indian_adaptation.trust_building || ''), 10);
      bdy('Language Strategy: ' + (r.indian_adaptation.language || ''), 10);
      bdy('Payment Strategy: ' + (r.indian_adaptation.payment || ''), 10);
    }

    // PAGE 4: REVENUE MODEL
    if (r.revenue_model) {
      doc.addPage(); y = 30;
      hdg('4. BUSINESS & REVENUE MODEL', [34, 197, 94]);
      bdy('Months 1-3: ' + (r.revenue_model.month_1_to_3 || ''), 10);
      bdy('Months 4-6: ' + (r.revenue_model.month_4_to_6 || ''), 10);
      bdy('Year 2 Scale: ' + (r.revenue_model.year_2 || ''), 10);
      bdy('Break-Even Target: ' + (r.revenue_model.break_even_target || ''), 10, true, [34, 197, 94]);
    }

    // PAGE 5: FREE TECH STACK
    if (r.free_tech_stack) {
      doc.addPage(); y = 30;
      hdg('5. FREE TECH STACK', [99, 102, 241]);
      const stack = r.free_tech_stack;
      Object.entries(stack).forEach(([key, val]) => {
        bdy(key.charAt(0).toUpperCase() + key.slice(1) + ': ' + val, 10);
      });
    }

    // PAGE 6: FINANCIAL BREAKDOWN
    doc.addPage(); y = 30;
    hdg('6. FINANCIAL BREAKDOWN (MAX INR ' + (r.budget || 0).toLocaleString('en-IN') + ')', [245, 158, 11]);
    if (r.financial_allocation?.line_items) {
      // Table header
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(80, 80, 80);
      doc.text('Item', M, y); doc.text('Cost', M + 100, y); doc.text('Free Alternative', M + 130, y);
      y += 6;
      doc.setDrawColor(200, 200, 200); doc.line(M, y, M + W, y); y += 5;
      doc.setFont('helvetica', 'normal');
      r.financial_allocation.line_items.forEach(item => {
        chk(8);
        doc.setTextColor(40, 40, 40);
        doc.text(safe(item.item || '').substring(0, 40), M, y);
        doc.text(safe(item.cost || ''), M + 100, y);
        doc.setTextColor(100, 100, 100);
        doc.text(safe(item.free_alternative || '').substring(0, 25), M + 130, y);
        y += 7;
      });
      y += 5;
      bdy('Total Spent: ' + (r.financial_allocation.total_spent || ''), 10, true);
      bdy('Emergency Reserve: ' + (r.financial_allocation.reserve || ''), 10);
    } else if (typeof r.financial_allocation === 'string') {
      bdy(r.financial_allocation, 10);
    }

    // PAGES 7-12: 6-MONTH ROADMAP
    if (r.six_month_roadmap) {
      r.six_month_roadmap.forEach((m) => {
        doc.addPage(); y = 30;
        hdg(m.month + ' — ' + (m.theme || ''), [34, 211, 238]);
        if (m.weekly_tasks) {
          m.weekly_tasks.forEach(task => {
            bdy('  ' + task, 10);
          });
        }
        y += 5;
        bdy('Milestone: ' + (m.milestone || ''), 10, true, [34, 211, 238]);
      });
    }

    // PAGE 13: RISK MATRIX
    if (r.critical_risks && Array.isArray(r.critical_risks)) {
      doc.addPage(); y = 30;
      hdg('RISK MATRIX', [244, 63, 94]);
      r.critical_risks.forEach((risk, i) => {
        chk(30);
        bdy(`Risk ${i + 1}: ${risk.risk || ''}`, 10, true, [244, 63, 94]);
        bdy(`Probability: ${risk.probability || 'N/A'} | Impact: ${risk.impact || 'N/A'}`, 9);
        bdy(`Mitigation: ${risk.mitigation || ''}`, 9);
        y += 3;
      });
    }

    // PAGE 14: LEGAL & COMPLIANCE
    if (r.legal_and_compliance) {
      doc.addPage(); y = 30;
      hdg('LEGAL & COMPLIANCE', [245, 158, 11]);
      bdy('Business Registration: ' + (r.legal_and_compliance.business_registration || ''), 10);
      bdy('GST Registration: ' + (r.legal_and_compliance.gst_registration || ''), 10);
      if (r.legal_and_compliance.required_documents) {
        bdy('Required Documents:', 10, true);
        r.legal_and_compliance.required_documents.forEach(d => bdy('  - ' + d, 9));
      }
      bdy('Warnings: ' + (r.legal_and_compliance.important_warnings || ''), 10, false, [244, 63, 94]);
    }

    // PAGE 15: WEBSITE MUST-HAVES
    if (r.website_must_haves) {
      doc.addPage(); y = 30;
      hdg('WEBSITE BLUEPRINT', [99, 102, 241]);
      r.website_must_haves.forEach((f, i) => bdy(`${i + 1}. ${f}`, 10));
    }

    // PAGE 16: FOUNDER SUPERPOWER + TIPS
    doc.addPage(); y = 30;
    hdg("FOUNDER'S EDGE", [34, 197, 94]);
    bdy(r.founder_superpower || '', 11);
    if (r.founder_tips) {
      y += 5;
      hdg('FOUNDER TIPS', [139, 92, 246]);
      r.founder_tips.forEach((tip, i) => bdy(`${i + 1}. ${tip}`, 10));
    }

    // PAGE 17: HONEST VERDICT
    if (r.honest_verdict) {
      doc.addPage(); y = 30;
      hdg('HONEST VERDICT', [244, 63, 94]);
      bdy('Viability Score: ' + (r.honest_verdict.viability_score || ''), 14, true, [34, 211, 238]);
      y += 3;
      bdy('Best Case: ' + (r.honest_verdict.best_case || ''), 10);
      bdy('Worst Case: ' + (r.honest_verdict.worst_case || ''), 10, false, [244, 63, 94]);
      y += 3;
      bdy('Make or Break Factor: ' + (r.honest_verdict.one_thing_that_will_make_or_break_this || ''), 11, true);
    }

    // PAGE 18: CREDITS
    doc.addPage();
    doc.setFillColor(12, 12, 32); doc.rect(0, 0, 210, 297, 'F');
    doc.setFillColor(139, 92, 246); doc.rect(0, 0, 6, 297, 'F');
    let fy = 60;
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(139, 92, 246);
    doc.text('POWERED BY', M, fy); fy += 12;
    doc.setFontSize(28); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Launchpad Bharat', M, fy); fy += 10;
    doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(150, 150, 190);
    doc.text("India's Premier Startup Architect Platform", M, fy); fy += 30;
    
    // Founder cards
    doc.setFillColor(28, 18, 52); doc.roundedRect(M, fy, W, 40, 3, 3, 'F');
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(139, 92, 246);
    doc.text('FOUNDER & CEO', M + 5, fy + 10);
    doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Jai Anand', M + 5, fy + 22);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(160, 160, 200);
    doc.text('Founder, Launchpad Bharat', M + 5, fy + 31);

    fy += 50;
    doc.setFillColor(28, 18, 52); doc.roundedRect(M, fy, W, 40, 3, 3, 'F');
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(139, 92, 246);
    doc.text('CO-FOUNDER', M + 5, fy + 10);
    doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Abhay Bansal', M + 5, fy + 22);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(160, 160, 200);
    doc.text('Co-Founder, Launchpad Bharat', M + 5, fy + 31);
    
    doc.save((r.startup_name || r.name || 'Blueprint') + '_Blueprint.pdf');
  };

  // ── Helper: get startup name from old or new schema ──────────────────────
  const getName = (r) => r?.startup_name || r?.name || 'Startup';

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Advanced <span className="text-accent">Startup Builder</span></h1>
        <p className="text-secondary" style={{ fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
          Welcome, {userName}. This tool gives you a <strong>brutally honest</strong> 18-page blueprint — real costs, real risks, real feasibility.
        </p>
      </div>

      {/* Saved Blueprints toggle */}
      {savedBlueprints.length > 0 && (
        <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
          <button onClick={() => setShowSaved(v => !v)} className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bookmark size={16} /> My Saved Blueprints ({savedBlueprints.length})
          </button>
        </div>
      )}

      {/* Saved Blueprints Panel */}
      {showSaved && savedBlueprints.length > 0 && (
        <div className="glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>Saved Blueprints</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {savedBlueprints.map((bp, i) => (
              <div
                key={i}
                onClick={() => { setResult(bp); setRating(bp.rating || 0); setShowSaved(false); resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                style={{ padding: '1rem', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.16)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'; }}
              >
                <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem', color: 'var(--accent-cyan)' }}>{getName(bp)}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{bp.niche} · INR {bp.budget?.toLocaleString('en-IN')}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Saved {new Date(bp.savedAt).toLocaleDateString('en-IN')}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 600 }}>Click to view full blueprint + download PDF</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ alignItems: 'start' }}>

        {/* LEFT: Structured Form */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--accent-purple)' }}>Structured Form</h3>
          <form onSubmit={(e) => { e.preventDefault(); runGenerate(); }} className="flex flex-col gap-5">
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your Skills</label>
              <CreatableSelect isMulti options={SKILLS} styles={selectStyles} placeholder="Search or add..." onChange={setSelectedSkills} formatCreateLabel={(v) => `Add "${v}"`} noOptionsMessage={() => 'Type a skill and press Enter'} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Target Niche / Industry</label>
              <CreatableSelect isMulti options={NICHES} styles={selectStyles} placeholder="Search or add..." onChange={setSelectedNiches} formatCreateLabel={(v) => `Add "${v}"`} noOptionsMessage={() => 'Type a niche and press Enter'} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Starting Capital (INR)</label>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0 1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center' }}>
                <span className="text-secondary" style={{ marginRight: '0.5rem', fontSize: '1.1rem' }}>INR</span>
                <input type="number" placeholder="e.g., 15000" value={budget} onChange={e => setBudget(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 0', background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '1rem' }} required />
              </div>
              {budget && Number(budget) < 5000 && (
                <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertTriangle size={13} /> Below minimum viability — service/consulting model will be suggested
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-primary mt-4" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
              {loading ? 'Building Blueprint...' : <><Wand2 size={18} /> Generate Honest Blueprint</>}
            </button>
          </form>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Talk to a Guide</h4>
            <a href="https://wa.me/919358022343" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '0.5rem 1rem', borderColor: '#25D366', color: '#25D366', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Smartphone size={16} /> WhatsApp
            </a>
          </div>
        </div>

        {/* CENTER: Chat Assistant */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--accent-cyan)' }}>AI Architect Chat</h3>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '380px', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', paddingRight: '0.25rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '90%', padding: '0.85rem 1rem', borderRadius: '1rem', background: m.role === 'user' ? 'rgba(34,211,238,0.12)' : 'rgba(255,255,255,0.04)', border: m.role === 'user' ? '1px solid rgba(34,211,238,0.25)' : '1px solid rgba(255,255,255,0.07)', lineHeight: 1.5, fontSize: '0.9rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem', color: m.role === 'user' ? 'var(--accent-cyan)' : 'var(--accent-purple)' }}>
                    {m.role === 'user' ? 'You' : 'AI Architect'}
                  </div>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '0.85rem 1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>
          <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Describe your idea, budget, skills..."
              style={{ flex: 1, padding: '0.85rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '0.9rem' }} />
            <button type="submit" className="btn" style={{ padding: '0 1.25rem', background: 'var(--accent-cyan)', color: 'black', fontWeight: 700 }}>→</button>
          </form>
          <button onClick={generateFromChat} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <Wand2 size={18} /> Generate Blueprint from Chat
          </button>
        </div>

        {/* RIGHT: Blueprint Output */}
        <div ref={resultRef} className="glass-panel" style={{ minHeight: '650px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Your Custom Blueprint</h3>

          {!result && !loading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <FileText size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>Fill the form and click Generate to get your 18-page startup blueprint.</p>
            </div>
          )}

          {loading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 50, height: 50, border: '4px solid var(--accent-purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '1rem' }}>AI is building your 18-page blueprint...</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Analyzing market, risks, legal, and financials...</p>
            </div>
          )}

          {result && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'float 0.4s ease-out' }}>
              {/* Header */}
              <div style={{ padding: '1.25rem', background: 'rgba(34,211,238,0.08)', borderRadius: '0.75rem', border: '1px solid rgba(34,211,238,0.2)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Startup Name</p>
                <h4 style={{ fontSize: '1.75rem', color: 'var(--accent-cyan)', margin: 0 }}>{getName(result)}</h4>
                {result.tagline && <p style={{ fontSize: '1rem', color: 'white', marginTop: '0.4rem', fontStyle: 'italic' }}>"{result.tagline}"</p>}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>{result.niche} · Budget: INR {result.budget?.toLocaleString('en-IN')}</p>
              </div>

              {/* Foreign Inspiration */}
              {result.foreign_inspiration && (
                <Section title="Foreign Inspiration" color="#6366f1">
                  <KVRow label="Company" value={result.foreign_inspiration.company} />
                  <KVRow label="Country" value={result.foreign_inspiration.country} />
                  <KVRow label="Gap" value={result.foreign_inspiration.why_not_in_india_yet} />
                </Section>
              )}

              {/* Problem & Solution */}
              <Section title="The Problem" color="#f43f5e">
                <Body>{result.problem_statement}</Body>
              </Section>

              <Section title="The Solution" color="#22c55e">
                <Body>{result.solution}</Body>
              </Section>

              {/* Indian Adaptation */}
              {result.indian_adaptation && (
                <Section title="Indian Market Adaptation" color="#f59e0b">
                  <KVRow label="Distribution" value={result.indian_adaptation.distribution} />
                  <KVRow label="Trust" value={result.indian_adaptation.trust_building} />
                  <KVRow label="Language" value={result.indian_adaptation.language} />
                  <KVRow label="Payment" value={result.indian_adaptation.payment} />
                </Section>
              )}

              {/* Free Tech Stack */}
              {result.free_tech_stack && (
                <Section title="Free Tech Stack" color="#6366f1">
                  {Object.entries(result.free_tech_stack).map(([k, v]) => (
                    <KVRow key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={v} />
                  ))}
                </Section>
              )}

              {/* Financial Allocation */}
              {result.financial_allocation && (
                <Section title={`Financial Allocation (Max INR ${result.budget?.toLocaleString('en-IN')})`} color="#f59e0b">
                  {result.financial_allocation.line_items ? (
                    <>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              <th style={{ textAlign: 'left', padding: '0.4rem 0', color: 'var(--accent-cyan)' }}>Item</th>
                              <th style={{ textAlign: 'right', padding: '0.4rem 0', color: 'var(--accent-cyan)' }}>Cost</th>
                              <th style={{ textAlign: 'right', padding: '0.4rem 0', color: 'var(--accent-cyan)' }}>Free Alt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.financial_allocation.line_items.map((item, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.35rem 0', color: 'var(--text-secondary)' }}>{item.item}</td>
                                <td style={{ padding: '0.35rem 0', textAlign: 'right', color: 'white', fontWeight: 600 }}>{item.cost}</td>
                                <td style={{ padding: '0.35rem 0', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{item.free_alternative}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#22c55e', fontWeight: 700 }}>Total: {result.financial_allocation.total_spent}</span>
                        <span style={{ color: '#f59e0b', fontWeight: 600 }}>Reserve: {result.financial_allocation.reserve}</span>
                      </div>
                    </>
                  ) : (
                    <Body>{typeof result.financial_allocation === 'string' ? result.financial_allocation : JSON.stringify(result.financial_allocation)}</Body>
                  )}
                </Section>
              )}

              {/* Revenue Model */}
              {result.revenue_model && (
                <Section title="Revenue Model" color="#22c55e">
                  <KVRow label="Month 1-3" value={result.revenue_model.month_1_to_3} />
                  <KVRow label="Month 4-6" value={result.revenue_model.month_4_to_6} />
                  <KVRow label="Year 2" value={result.revenue_model.year_2} />
                  <KVRow label="Break-Even" value={result.revenue_model.break_even_target} />
                </Section>
              )}

              {/* 6-Month Roadmap */}
              {result.six_month_roadmap && (
                <Section title="6-Month Execution Roadmap" color="#22d3ee">
                  {result.six_month_roadmap.map((m, i) => (
                    <div key={i} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'rgba(34,211,238,0.06)', borderRadius: '0.5rem', border: '1px solid rgba(34,211,238,0.12)' }}>
                      <p style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>{m.month} — {m.theme}</p>
                      {m.weekly_tasks?.map((t, j) => (
                        <p key={j} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.5rem', lineHeight: 1.5 }}>• {t}</p>
                      ))}
                      <p style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 600, marginTop: '0.3rem' }}>Milestone: {m.milestone}</p>
                    </div>
                  ))}
                </Section>
              )}

              {/* Critical Risks */}
              {result.critical_risks && Array.isArray(result.critical_risks) && (
                <Section title="Risk Matrix" color="#f43f5e">
                  {result.critical_risks.map((risk, i) => (
                    <div key={i} style={{ marginBottom: '0.6rem', padding: '0.6rem', background: 'rgba(244,63,94,0.06)', borderRadius: '0.5rem' }}>
                      <p style={{ fontWeight: 700, color: '#f43f5e', fontSize: '0.85rem' }}>{risk.risk}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Probability: {risk.probability} | Impact: {risk.impact}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{risk.mitigation}</p>
                    </div>
                  ))}
                </Section>
              )}

              {/* Legal & Compliance */}
              {result.legal_and_compliance && (
                <Section title="Legal & Compliance" color="#f59e0b">
                  <KVRow label="Registration" value={result.legal_and_compliance.business_registration} />
                  <KVRow label="GST" value={result.legal_and_compliance.gst_registration} />
                  {result.legal_and_compliance.required_documents?.map((d, i) => (
                    <p key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>• {d}</p>
                  ))}
                  <p style={{ fontSize: '0.8rem', color: '#f43f5e', marginTop: '0.4rem', fontWeight: 600 }}>{result.legal_and_compliance.important_warnings}</p>
                </Section>
              )}

              {/* Website Must-Haves */}
              {result.website_must_haves && (
                <Section title="Website Blueprint" color="#6366f1">
                  {result.website_must_haves.map((f, i) => (
                    <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '0.4rem', color: '#22c55e' }} />{f}
                    </p>
                  ))}
                </Section>
              )}

              {/* Founder Superpower */}
              {result.founder_superpower && (
                <Section title="Your Unfair Advantage" color="#22c55e">
                  <Body>{result.founder_superpower}</Body>
                </Section>
              )}

              {/* Founder Tips */}
              {result.founder_tips && (
                <Section title="Founder Tips" color="#8b5cf6">
                  {result.founder_tips.map((tip, i) => (
                    <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>{i + 1}.</span> {tip}
                    </p>
                  ))}
                </Section>
              )}

              {/* Honest Verdict */}
              {result.honest_verdict && (
                <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(244,63,94,0.08), rgba(139,92,246,0.08))', borderRadius: '0.75rem', border: '1px solid rgba(244,63,94,0.25)' }}>
                  <p style={{ fontWeight: 700, color: '#f43f5e', fontSize: '0.85rem', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Honest Verdict</p>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                    {result.honest_verdict.viability_score}
                  </p>
                  <KVRow label="Best Case" value={result.honest_verdict.best_case} />
                  <KVRow label="Worst Case" value={result.honest_verdict.worst_case} />
                  <div style={{ marginTop: '0.5rem', padding: '0.6rem', background: 'rgba(244,63,94,0.1)', borderRadius: '0.4rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#f43f5e', fontWeight: 700 }}>Make or Break:</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{result.honest_verdict.one_thing_that_will_make_or_break_this}</p>
                  </div>
                </div>
              )}

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Rate this blueprint:</span>
                <StarRating value={rating} onChange={setRating} />
              </div>

              {/* Like / Dislike / Download */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '0.75rem' }}>
                <button onClick={handleLike} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', borderColor: 'rgba(34,197,94,0.4)', color: '#22c55e', padding: '0.75rem' }}>
                  <ThumbsUp size={18} /> Save
                </button>
                <button onClick={handleDislike} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', borderColor: 'rgba(244,63,94,0.4)', color: '#f43f5e', padding: '0.75rem' }}>
                  <ThumbsDown size={18} /> Retry
                </button>
                <button onClick={generatePDF} className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #10b981, #059669)', padding: '0.75rem' }}>
                  <Download size={18} /> Download 18-Page PDF
                </button>
              </div>

              {/* Hire CTA */}
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 211, 238, 0.05)', border: '1px solid rgba(34, 211, 238, 0.3)', borderRadius: '0.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Overwhelmed by the technical requirements?</p>
                <a 
                  href="https://wa.me/919358022343?text=Hi%20Launchpad%20Bharat,%20I%20just%20generated%20a%20Startup%20Blueprint%20and%20need%20help%20building%20the%20tech!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn" 
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(34, 211, 238, 0.2)', fontSize: '0.95rem' }}
                >
                  Hire Our Code Team (Starting at INR 1000)
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AIGenerators;
