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

// ─── Budget Feasibility Logic ──────────────────────────────────────────────
const COST_TABLE = (niche, budget, skillList) => {
  const isDigital = ['SaaS', 'Gaming & E-sports', 'EdTech', 'FinTech', 'Creator Economy'].includes(niche);
  const isPhysical = ['E-commerce', 'D2C Brands', 'Food & Beverage', 'Local Retail Management'].includes(niche);
  const sList = skillList.toLowerCase();
  
  const hasTech = sList.includes('web dev') || sList.includes('react') || sList.includes('python') || sList.includes('app dev') || sList.includes('software');
  const hasMarketing = sList.includes('marketing') || sList.includes('sales') || sList.includes('seo') || sList.includes('social media');
  const hasDesign = sList.includes('ui/ux') || sList.includes('graphic') || sList.includes('video editing');
  
  const base = [
    { item: '.com / .in Domain (1 year)', base: 799 },
    { item: 'Web Hosting (Shared, 1 year)', base: 1499 },
    { item: 'Business Email (Google Workspace)', base: 750 },
    { item: 'SSL Certificate & Gateway Setup', base: 0, note: 'Free via Let\'s Encrypt / Razorpay' },
  ];

  // Legal Compliance dynamic allocation
  if (budget >= 50000) {
    base.push({ item: 'Private Limited Company Registration', base: 8500, note: 'Required for raising VC funding' });
    base.push({ item: 'Trademark Filing (Govt Fees)', base: 4500, note: 'Brand protection' });
  } else {
    base.push({ item: 'Sole Proprietorship Registration', base: 1500, note: 'MSME/Udyam is free, CA fee for GST/Setup' });
  }

  // Developer costs
  if (!hasTech) {
    base.push({ item: 'MVP App/Web Development (Freelance)', base: budget > 30000 ? 15000 : 8000, note: 'No in-house tech talent found in skills' });
  }
  
  // Marketing & Design
  if (!hasDesign) {
    base.push({ item: 'Logo + Branding (Designer)', base: 1500 });
  }
  if (!hasMarketing) {
    base.push({ item: 'Digital Marketing (Month 1 Ads)', base: 5000, note: 'Hiring agency/freelancer for initial push' });
  } else {
    base.push({ item: 'Direct Ad Spend (Self-managed)', base: 2000, note: 'Zero agency fees due to marketing skills' });
  }

  if (isDigital && budget >= 25000) {
     base.push({ item: 'Cloud Infrastructure (AWS/Supabase)', base: 2500 });
  }
  if (isPhysical) {
    base.push({ item: 'Inventory/Sample Stock (Minimum)', base: budget > 20000 ? 10000 : 3500 });
    base.push({ item: 'Packaging & Logistics Setup', base: 1500 });
  }

  return base.map(row => ({
    ...row,
    gst: row.base > 0 ? Math.round(row.base * 0.18) : 0,
    total: row.base > 0 ? Math.round(row.base * 1.18) : 0,
  }));
};

const computeName = (niche, skills) => {
  const nicheMap = {
    'E-commerce': ['KartNest', 'ShopDisha', 'BharatCart'],
    'Gaming & E-sports': ['ArenaEdge', 'SkillArena', 'ProCircuit'],
    'SaaS': ['FlowStack', 'NestLogic', 'PulseKit'],
    'EdTech': ['SkillVeda', 'LernPathway', 'MindRise'],
    'FinTech': ['PayDisha', 'CoinRoots', 'WealthVeda'],
    'D2C Brands': ['BharatDirect', 'RootBrands', 'CraftCircle'],
    'AgriTech': ['KisanEdge', 'HarvestAI', 'FieldStack'],
    'Food & Beverage': ['RasaBox', 'ThaliDirect', 'SpiceRoute'],
    'Creator Economy': ['SpotlightIN', 'CreatorDen', 'ViralRoots'],
    'Healthcare': ['CareNest', 'VitalBridge', 'HealthDisha'],
  };
  const options = nicheMap[niche] || ['LaunchCore', 'BuildBridge', 'StartEdge'];
  return options[Math.floor(Math.random() * options.length)];
};

// ─── Blueprint Generator ───────────────────────────────────────────────────
const buildBlueprint = (skills, niches, budget, rejectedNames = []) => {
  const bNum = Number(budget);
  const niche = niches[0]?.value || 'E-commerce';
  const skillListRaw = skills.map(s => s.label).join(', ');
  const sList = skillListRaw.toLowerCase();
  
  const hasTech = sList.includes('web dev') || sList.includes('react') || sList.includes('python') || sList.includes('app dev') || sList.includes('software');

  const costs = COST_TABLE(niche, bNum, skillListRaw);
  const totalCost = costs.reduce((s, r) => s + r.total, 0);

  const dynamicMinViable = !hasTech ? 12000 : 5000;
  
  const isInsufficient = bNum < dynamicMinViable;
  const isTight = bNum >= dynamicMinViable && bNum < totalCost;

  let name = computeName(niche, skills);
  while (rejectedNames.includes(name)) {
    name = computeName(niche, skills) + 'Pro';
  }

  const pivotStrategy = isInsufficient ? {
    active: true,
    text: `With ₹${bNum}, you cannot legally operate or build this setup. Because you lack the necessary cross-functional skills, you must pay external operators. The absolute minimum to go live is ~₹${totalCost.toLocaleString('en-IN')} incl. GST. Pivot Path: Use your existing skills (${skillListRaw || 'general tasks'}) to freelance for 1 month. Save the ₹${(totalCost - bNum).toLocaleString('en-IN')} difference before launching the actual startup.`,
    target: totalCost,
  } : null;

  const techStack = hasTech 
    ? (bNum < 20000 ? 'Self-Coded MVP: Ship fast with Next.js/Tailwind & Supabase. Host on Vercel (Free). Zero Tech Cost.' : 'Custom Production Stack: React/Node on AWS EC2 or DigitalOcean. You code it; spend budget on premium APIs like OpenAI.')
    : (bNum < 20000 ? 'No-Code Stack: You must use Bubble.io or Shopify. Do not hire expensive coders yet. Use standard templates.' : 'Freelance MVP: Hire a mid-level React/Flutter developer. Keep the scope strictly to ONE core feature to avoid burning your ₹' + bNum + ' budget.');

  const isEcom = ['E-commerce', 'D2C Brands', 'Local Retail Management'].includes(niche);

  const roadmap = [
    `Month 1 (Validation): ${isEcom ? 'Finalize vendor sourcing and order minimum sample quantities.' : 'Conduct 30 customer interviews in your city to validate the pain point.'} Lock name "${name}", domain, and social handles.`,
    `Month 2 (Build & Setup): ${hasTech ? "Code the MVP yourself." : "Hire an external freelancer to build the MVP or No-Code it."} Setup Razorpay & legal compliance.`,
    `Month 3 (Soft Launch): Open to 100 beta testers. ${isEcom ? "Run small localized WhatsApp delivery campaigns." : "Reach out organically via LinkedIn and Twitter/X."} Collect NPS feedback.`,
    `Month 4 (Iterate & Monetize): Fix top 3 complaints based on beta data. Introduce paid tiers or full-price products.`,
    `Month 5 (Acquire): Inject ₹${Math.round(bNum * 0.2)} into targeted Meta/Google ads. Track Customer Acquisition Cost (CAC) relentlessly.`,
    `Month 6 (Scale or Pivot): If CAC translates to profitable LTV — double down on ad spend. If not, pivot the product offering immediately.`,
  ];

  return {
    name,
    niche,
    budget: bNum,
    costs,
    totalCost,
    isInsufficient,
    isTight,
    pivotStrategy,
    realityCheck: isInsufficient
      ? `⚠️ AI Reality Check: ₹${bNum} is insufficient. The calculated external costs (₹${totalCost.toLocaleString('en-IN')} incl. GST) consume your runway.`
      : isTight
      ? `⚠️ Tight Runway: ₹${bNum} barely covers startup setup (₹${totalCost.toLocaleString('en-IN')} incl. GST). Operate extremely lean.`
      : `✅ Viable Runway: ₹${bNum} clears the minimum robust setup cost (₹${totalCost.toLocaleString('en-IN')}). Execute fast.`,
    execStrategy: `Step 1: Register "${name}". Step 2: Use ${hasTech ? "your coding skills" : "No-Code tools / freelancers"} to build the MVP. Step 3: Leverage your unique skills (${skillListRaw}) to hustle for the first 10 paying customers without spending money on Ads.`,
    monetization: `Phase 1 (Months 1–3): Penetration pricing to build initial traction. Phase 2 (Months 4–6): Launch premium segment. Maintain tight LTV:CAC ratio.`,
    techStack,
    roadmap,
    skillList: skillListRaw,
  };
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

  // Initial load logic for Scroll to top + URL Cart logic
  useEffect(() => {
    window.scrollTo(0, 0);
    if (searchParams.get('saved') === 'true' && savedBlueprints.length > 0) {
      setShowSaved(true);
      // Optional: remove query string so refreshing doesn't keep it open
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
      let reply = 'Interesting angle. What is your starting capital (in ₹) and your primary skill set? That determines whether this idea is viable or needs a pivot.';
      if (/\d{3,}/.test(chatInput)) reply = `Got the budget figure. Now — what is your primary skill? Web Dev, Marketing, Operations? That shapes how I build the execution strategy for you.`;
      else if (/skill|dev|design|market/i.test(chatInput)) reply = `Noted the skills. You can hit "Generate Blueprint from Chat" now, or keep refining. I need your ₹ budget to validate feasibility.`;
      setMessages([...newMessages, { role: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  const runGenerate = (rejected = rejectedNames) => {
    if (selectedSkills.length === 0 || selectedNiches.length === 0 || !budget) {
      alert('Please fill in Skills, Niche, and Starting Budget before generating.');
      return;
    }
    setLoading(true);
    setResult(null);
    setRating(0);
    // User requested NO scrolling down dynamically. Stays on skill section.
    setTimeout(() => {
      const bp = buildBlueprint(selectedSkills, selectedNiches, budget, rejected);
      setResult(bp);
      setLoading(false);
    }, 1800);
  };

  const handleLike = () => {
    if (!result) return;
    const entry = { ...result, savedAt: new Date().toISOString(), rating };
    const updated = [entry, ...savedBlueprints.filter(b => b.name !== result.name)];
    setSavedBlueprints(updated);
    localStorage.setItem('saved_blueprints', JSON.stringify(updated));
    alert(`"${result.name}" saved to your Saved Blueprints!`);
  };

  const handleDislike = () => {
    if (!result) return;
    const newRejected = [...rejectedNames, result.name];
    setRejectedNames(newRejected);
    runGenerate(newRejected);
  };

  const generateFromChat = () => {
    if (!budget) setBudget('15000');
    if (selectedNiches.length === 0) setSelectedNiches([{ label: 'E-commerce', value: 'E-commerce' }]);
    if (selectedSkills.length === 0) setSelectedSkills([{ label: 'Web Development', value: 'Web Development' }]);
    runGenerate(rejectedNames);
  };

  // ── PDF Download ──────────────────────────────────────────────────────────
  const generatePDF = () => {
    if (!result) return;
    if (!result) return;
    const doc = new jsPDF();
    const M = 20, W = 170;
    let y = 20;

    const safe = (t) => String(t).replace(/[^\x00-\x7F]/g, c =>
      ({ '₹': 'INR ', '✅': '[OK]', '⚠️': '[!]', '❌': '[X]' }[c] || ''));

    const chk = (n = 12) => { if (y + n > 275) { doc.addPage(); y = 22; } };

    const hdg = (text, color = [34, 211, 238]) => {
      chk(16); doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(...color);
      doc.text(safe(text), M, y); y += 5;
      doc.setDrawColor(...color); doc.setLineWidth(0.3); doc.line(M, y, M + W, y); y += 6;
    };

    const bdy = (text, size = 10, bold = false, color = [40, 40, 40]) => {
      chk(size + 4); doc.setFontSize(size); doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(...color);
      doc.splitTextToSize(safe(text), W).forEach(l => { chk(size + 2); doc.text(l, M, y); y += size >= 13 ? 7 : 5.5; });
      y += 2;
    };

    const blt = (text) => {
      chk(12); doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(50, 50, 50);
      doc.splitTextToSize(safe('- ' + text), W - 4).forEach(l => { chk(10); doc.text(l, M + 4, y); y += 5; });
    };

    // PAGE 1: COVER
    doc.setFillColor(12, 12, 32); doc.rect(0, 0, 210, 297, 'F');
    doc.setFillColor(139, 92, 246); doc.rect(0, 0, 6, 297, 'F');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(139, 92, 246);
    doc.text('LAUNCHPAD BHARAT', M, 38);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 160);
    doc.text("India's Startup Blueprint Engine", M, 46);
    doc.setFontSize(9); doc.setTextColor(180, 180, 210); doc.text('OFFICIAL STARTUP AUDIT REPORT', M, 68);
    doc.setFontSize(32); doc.setFont('helvetica', 'bold'); doc.setTextColor(34, 211, 238);
    const nameL = doc.splitTextToSize(result.name, W);
    nameL.forEach((l, i) => doc.text(l, M, 80 + i * 13));
    const my = 80 + nameL.length * 13 + 8;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(160, 160, 200);
    doc.text('Niche: ' + result.niche, M, my);
    doc.text('Capital: INR ' + result.budget.toLocaleString('en-IN'), M, my + 10);
    doc.text('Prepared for: ' + userName, M, my + 20);
    doc.text('Date: ' + new Date().toLocaleDateString('en-IN'), M, my + 30);
    doc.setDrawColor(139, 92, 246); doc.setLineWidth(0.5); doc.line(M, my + 40, M + W, my + 40);
    const bY = my + 52;
    const bC = result.isInsufficient ? [244, 63, 94] : result.isTight ? [245, 158, 11] : [34, 197, 94];
    const bL = result.isInsufficient ? 'INSUFFICIENT BUDGET -- Pivot Required' : result.isTight ? 'TIGHT BUDGET -- Lean Only' : 'VIABLE -- Ready to Execute';
    doc.setFillColor(...bC); doc.roundedRect(M, bY - 5, W, 12, 2, 2, 'F');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text(bL, M + W / 2, bY + 3, { align: 'center' });
    doc.setFontSize(8); doc.setTextColor(70, 70, 100);
    doc.text('Confidential. For personal business use only.', M, 282);
    doc.text('Generated by Launchpad Bharat', M + W, 282, { align: 'right' });

    // PAGE 2: ANALYSIS
    doc.addPage(); y = 22;
    bdy(result.name + ' -- Startup Blueprint', 17, true, [139, 92, 246]);
    y += 3;

    hdg('SECTION 1 -- HONEST REALITY CHECK', [244, 63, 94]);
    bdy(result.realityCheck, 10);
    if (result.pivotStrategy) {
      y += 3; hdg('PIVOT STRATEGY -- Build Capital First', [244, 63, 94]);
      bdy(result.pivotStrategy.text, 10); y += 2;
      bdy('Action: Earn INR ' + (result.pivotStrategy.target || 8000).toLocaleString('en-IN') + ' via freelance before launching.', 10, true, [244, 63, 94]);
    }
    y += 5;

    hdg('SECTION 2 -- FINANCIAL TABLE (18% GST Applied)', [34, 211, 238]);
    bdy('All costs sourced from real Indian market rates 2025-26. GST at 18% on digital services.', 9, false, [80, 80, 80]);
    y += 3;
    chk(12);
    doc.setFillColor(139, 92, 246); doc.rect(M, y, W, 9, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Expense Item', M + 2, y + 6); doc.text('Base', M + 100, y + 6);
    doc.text('GST', M + 128, y + 6); doc.text('Total (INR)', M + 151, y + 6);
    y += 11;
    result.costs.forEach((row, i) => {
      chk(10);
      if (i % 2 === 0) { doc.setFillColor(245, 245, 255); doc.rect(M, y - 2, W, 8, 'F'); }
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(30, 30, 30);
      doc.text(doc.splitTextToSize(safe(row.item + (row.note ? ' (' + row.note + ')' : '')), 85)[0], M + 2, y + 4);
      doc.text(row.base > 0 ? row.base.toString() : '0', M + 103, y + 4);
      doc.text(row.gst > 0 ? row.gst.toString() : '--', M + 130, y + 4);
      doc.setFont('helvetica', 'bold');
      doc.text(row.total > 0 ? row.total.toString() : '0', M + 155, y + 4);
      y += 8;
    });
    chk(12);
    doc.setFillColor(34, 211, 238); doc.rect(M, y, W, 10, 'F');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(12, 12, 32);
    doc.text('TOTAL MINIMUM INVESTMENT', M + 2, y + 7);
    doc.text('INR ' + result.totalCost.toLocaleString('en-IN'), M + 150, y + 7);
    y += 13;
    bdy('Your Capital: INR ' + result.budget.toLocaleString('en-IN') + '  |  Surplus: INR ' + Math.max(0, result.budget - result.totalCost).toLocaleString('en-IN'), 9, true, [80, 80, 80]);
    y += 5;

    hdg('SECTION 3 -- EXECUTION STRATEGY', [139, 92, 246]);
    bdy('Skills: ' + safe(result.skillList), 9, true, [80, 80, 80]); y += 2;
    bdy(result.execStrategy, 10); y += 3;
    hdg('TECH STACK', [139, 92, 246]);
    bdy(result.techStack, 10); y += 5;

    hdg('SECTION 4 -- COMPETITIVE LANDSCAPE', [34, 211, 238]);
    blt('Incumbents are metro-focused, ignoring 400M+ tier-2/3 internet users who need simpler products.');
    blt('Your edge: ' + safe((result.skillList || '').split(',')[0]) + ' expertise + community = lower CAC than VC-funded rivals.');
    blt('Trust moat: WhatsApp-first support vs. competitor ticket systems. Human touch wins in India.');
    blt('Price moat: Launch 40% below competitors -- viable because startup cost base is 60% lower.');
    blt('Launch a 100-person WhatsApp group pre-launch to keep CAC near INR 0 in Months 1-2.');
    y += 5;

    hdg('SECTION 5 -- 12-MONTH REVENUE PROJECTIONS', [34, 211, 238]);
    bdy('Conservative model: 8% paid conversion by Month 6, INR 499/month Pro pricing.', 9, false, [80, 80, 80]);
    y += 3;
    chk(12);
    doc.setFillColor(139, 92, 246); doc.rect(M, y, W, 9, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Period', M + 2, y + 6); doc.text('Users', M + 62, y + 6);
    doc.text('Paid', M + 100, y + 6); doc.text('MRR (INR)', M + 138, y + 6);
    y += 11;
    [['Month 1',10,0],['Month 2',30,0],['Month 3',70,0.05],['Month 4',120,0.06],
     ['Month 5',180,0.07],['Month 6',250,0.08],['Month 7-9',400,0.09],['Month 10-12',650,0.10]
    ].forEach(([m, u, p], i) => {
      chk(10); const paid = Math.floor(u * p); const mrr = paid * 499;
      if (i % 2 === 0) { doc.setFillColor(248, 248, 255); doc.rect(M, y - 2, W, 8, 'F'); }
      doc.setFont('helvetica', i === 7 ? 'bold' : 'normal'); doc.setFontSize(9); doc.setTextColor(30, 30, 30);
      doc.text(m, M + 2, y + 4); doc.text(String(u), M + 65, y + 4); doc.text(String(paid), M + 103, y + 4);
      if (mrr > 0) { doc.setFont('helvetica', 'bold'); doc.setTextColor(34, 150, 94); }
      doc.text(mrr > 0 ? mrr.toLocaleString('en-IN') : '--', M + 140, y + 4);
      doc.setTextColor(30, 30, 30); y += 8;
    });
    y += 5; bdy('Year-End ARR Target: INR 3,89,000+ | Break-even expected Month 4.', 9, true, [34, 197, 94]); y += 5;

    hdg('SECTION 6 -- RISK MATRIX', [244, 63, 94]);
    chk(12);
    doc.setFillColor(244, 63, 94); doc.rect(M, y, W, 9, 'F');
    doc.setFontSize(8.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Risk', M + 2, y + 6); doc.text('Prob', M + 83, y + 6);
    doc.text('Impact', M + 108, y + 6); doc.text('Mitigation', M + 133, y + 6);
    y += 11;
    [
      ['No Product-Market Fit (Months 1-2)', 'HIGH','HIGH', '30 interviews before building. Ship only when 10 say they will pay.'],
      ['Cash Runway Ends', 'MED','HIGH', 'Reserve 15%. Freelance as bridge income.'],
      ['Competitor Price War', 'MED','MED', 'Compete on community trust, not price.'],
      ['GST Non-Compliance', 'LOW','HIGH', 'Register GST when revenue exceeds INR 20L. Use a CA.'],
      ['Technical Downtime', 'LOW','MED', 'Deploy on Vercel/Railway. Aim for 99.5% uptime.'],
    ].forEach((r, i) => {
      chk(16);
      if (i % 2 === 0) { doc.setFillColor(255, 248, 248); doc.rect(M, y - 2, W, 14, 'F'); }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(30, 30, 30);
      doc.text(safe(r[0]), M + 2, y + 5);
      const pC = r[1] === 'HIGH' ? [200,40,40] : r[1] === 'MED' ? [190,110,0] : [40,150,70];
      doc.setTextColor(...pC); doc.text(r[1], M + 85, y + 5);
      const iC = r[2] === 'HIGH' ? [200,40,40] : r[2] === 'MED' ? [190,110,0] : [40,150,70];
      doc.setTextColor(...iC); doc.text(r[2], M + 110, y + 5);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(50, 50, 50);
      doc.splitTextToSize(safe(r[3]), 50).forEach((l, li) => doc.text(l, M + 133, y + 5 + li * 4.5));
      y += 14;
    });
    y += 5;

    hdg('SECTION 7 -- MONETIZATION MODEL', [139, 92, 246]);
    bdy(result.monetization, 10); y += 5;

    hdg('SECTION 8 -- 6-MONTH EXECUTION ROADMAP', [34, 211, 238]);
    result.roadmap.forEach((step, i) => {
      chk(18);
      doc.setFillColor(20, 30, 60); doc.roundedRect(M, y - 1, W, 14, 2, 2, 'F');
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(34, 211, 238);
      doc.text('M' + (i + 1), M + 2, y + 6);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(200, 200, 220);
      const lines = doc.splitTextToSize(safe(step), W - 16);
      lines.forEach((l, li) => doc.text(l, M + 12, y + 6 + li * 4.5));
      y += Math.max(15, 6 + lines.length * 4.5 + 2);
    });

    // FINAL PAGE: FOUNDERS + COMMUNITY
    doc.addPage();
    doc.setFillColor(12, 12, 32); doc.rect(0, 0, 210, 297, 'F');
    doc.setFillColor(139, 92, 246); doc.rect(0, 0, 6, 297, 'F');
    let fy = 40;
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(139, 92, 246);
    doc.text('PREPARED & POWERED BY', M, fy); fy += 11;
    doc.setFontSize(26); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Launchpad Bharat', M, fy); fy += 10;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(150, 150, 190);
    doc.text("India's Startup Blueprint Engine", M, fy); fy += 18;
    doc.setDrawColor(139, 92, 246); doc.setLineWidth(0.4); doc.line(M, fy, M + W, fy); fy += 12;

    // Founder cards
    doc.setFillColor(28, 18, 52); doc.roundedRect(M, fy, W, 40, 3, 3, 'F');
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(139, 92, 246);
    doc.text('FOUNDER', M + 5, fy + 9);
    doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Jai Anand', M + 5, fy + 21);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(160, 160, 200);
    doc.text('Founder, Launchpad Bharat', M + 5, fy + 30);
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(139, 92, 246);
    doc.text('CO-FOUNDER', M + 95, fy + 9);
    doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Abhay Bansal', M + 95, fy + 21);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(160, 160, 200);
    doc.text('Co-Founder, Launchpad Bharat', M + 95, fy + 30);
    fy += 50;

    // Contact
    doc.setFillColor(18, 38, 58); doc.roundedRect(M, fy, W, 32, 3, 3, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(34, 211, 238);
    doc.text('CONTACT & SUPPORT', M + 5, fy + 10);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(200, 210, 230);
    doc.text('WhatsApp:  +91 93580 22343', M + 5, fy + 20);
    doc.text('Website:   launchpadbharat.in', M + 5, fy + 28);
    fy += 44;

    // Community CTA
    doc.setFillColor(10, 55, 35); doc.roundedRect(M, fy, W, 52, 3, 3, 'F');
    doc.setDrawColor(34, 197, 94); doc.setLineWidth(1); doc.roundedRect(M, fy, W, 52, 3, 3, 'S');
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(34, 197, 94);
    doc.text('JOIN OUR FOUNDER COMMUNITY', M + W / 2, fy + 14, { align: 'center' });
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(180, 230, 200);
    doc.text('Connect with 1000+ Indian founders. Get feedback, resources & mentorship.', M + W / 2, fy + 24, { align: 'center' });
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('WhatsApp Community Link:', M + W / 2, fy + 36, { align: 'center' });
    doc.setFontSize(8); doc.setTextColor(34, 211, 238);
    doc.text('chat.whatsapp.com/Ey4FCxCjL9x9fH698xNnkO', M + W / 2, fy + 44, { align: 'center' });
    fy += 66;
    doc.setFontSize(7.5); doc.setTextColor(60, 60, 90);
    doc.text('Generated for ' + userName + ' on ' + new Date().toLocaleDateString('en-IN') + '. All projections are estimates based on market research.', M, fy);
    doc.text('Launchpad Bharat does not guarantee business outcomes.', M, fy + 8);

    // Watermark
    const tp = doc.internal.getNumberOfPages();
    for (let i = 1; i <= tp; i++) {
      doc.setPage(i);
      doc.setGState(new doc.GState({ opacity: 0.04 }));
      doc.setTextColor(139, 92, 246); doc.setFontSize(52);
      doc.text('Launchpad Bharat', 105, 155, { angle: 45, align: 'center' });
      doc.setGState(new doc.GState({ opacity: 1 }));
    }

    doc.save(result.name + '_Blueprint_LaunchpadBharat.pdf');
  };

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Advanced <span className="text-accent">Startup Builder</span></h1>
        <p className="text-secondary" style={{ fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
          Welcome, {userName}. This tool gives you a <strong>brutally honest</strong> blueprint — real costs, real GST, real feasibility.
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
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>📌 Saved Blueprints</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {savedBlueprints.map((bp, i) => (
              <div
                key={i}
                onClick={() => { setResult(bp); setRating(bp.rating || 0); setShowSaved(false); resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                style={{ padding: '1rem', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.16)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'; }}
              >
                <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem', color: 'var(--accent-cyan)' }}>{bp.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{bp.niche} · ₹{bp.budget?.toLocaleString('en-IN')}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Saved {new Date(bp.savedAt).toLocaleDateString('en-IN')}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 600 }}>Click to view full blueprint + download PDF →</p>
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
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Starting Capital (₹)</label>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0 1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center' }}>
                <span className="text-secondary" style={{ marginRight: '0.5rem', fontSize: '1.1rem' }}>₹</span>
                <input type="number" placeholder="e.g., 15000" value={budget} onChange={e => setBudget(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 0', background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '1rem' }} required />
              </div>
              {budget && Number(budget) < 5000 && (
                <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertTriangle size={13} /> Below minimum viability — pivot strategy will be generated
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
              <p>Fill the form and click Generate to get your honest, cost-validated startup blueprint.</p>
            </div>
          )}

          {loading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 50, height: 50, border: '4px solid var(--accent-purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '1rem' }}>Running feasibility analysis...</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Calculating real costs with 18% GST...</p>
            </div>
          )}

          {result && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'float 0.4s ease-out' }}>
              {/* Header */}
              <div style={{ padding: '1.25rem', background: 'rgba(139,92,246,0.1)', borderRadius: '0.75rem', border: '1px solid rgba(139,92,246,0.3)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Startup Name</p>
                <h4 style={{ fontSize: '1.75rem', color: 'var(--accent-cyan)', margin: 0 }}>{result.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{result.niche} · ₹{result.budget.toLocaleString('en-IN')}</p>
              </div>

              {/* Reality Check */}
              <div style={{ padding: '1rem', borderRadius: '0.75rem', background: result.isInsufficient ? 'rgba(244,63,94,0.08)' : result.isTight ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)', border: `1px solid ${result.isInsufficient ? 'rgba(244,63,94,0.3)' : result.isTight ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)'}`, fontSize: '0.9rem', lineHeight: 1.6 }}>
                {result.realityCheck}
              </div>

              {/* Pivot Strategy */}
              {result.pivotStrategy && (
                <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '0.75rem', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  <p style={{ fontWeight: 700, color: '#f43f5e', marginBottom: '0.4rem' }}>⚡ Pivot Strategy — Build Capital First</p>
                  {result.pivotStrategy.text}
                </div>
              )}

              {/* Cost Table */}
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Financial Breakdown (Real Rates + 18% GST)
                </p>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--accent-purple)' }}>
                        <th style={{ padding: '0.5rem', textAlign: 'left', borderRadius: '0.25rem 0 0 0.25rem' }}>Expense</th>
                        <th style={{ padding: '0.5rem', textAlign: 'right' }}>Base</th>
                        <th style={{ padding: '0.5rem', textAlign: 'right' }}>GST</th>
                        <th style={{ padding: '0.5rem', textAlign: 'right', borderRadius: '0 0.25rem 0.25rem 0' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.costs.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>
                            {row.item}{row.note && <span style={{ opacity: 0.6 }}> ({row.note})</span>}
                          </td>
                          <td style={{ padding: '0.5rem', textAlign: 'right' }}>₹{row.base}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'right', color: '#f59e0b' }}>{row.gst > 0 ? `₹${row.gst}` : '—'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600 }}>₹{row.total || 0}</td>
                        </tr>
                      ))}
                      <tr style={{ background: 'rgba(139,92,246,0.1)', fontWeight: 700, color: 'var(--accent-purple)' }}>
                        <td style={{ padding: '0.5rem' }}>Total Minimum</td>
                        <td colSpan={2} />
                        <td style={{ padding: '0.5rem', textAlign: 'right' }}>₹{result.totalCost.toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Execution & Roadmap Preview */}
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.07)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                <p style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '0.35rem' }} />Execution Strategy
                </p>
                {result.execStrategy}
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.07)', fontSize: '0.85rem' }}>
                <p style={{ fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>6-Month Roadmap</p>
                {result.roadmap.slice(0, 3).map((step, i) => (
                  <p key={i} style={{ marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>• {step}</p>
                ))}
                <p style={{ opacity: 0.5, fontSize: '0.8rem', fontStyle: 'italic' }}>...full roadmap in PDF</p>
              </div>

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
                  <Download size={18} /> Download Startup Packet (PDF)
                </button>
              </div>

              {/* Monetization / Hire CTA */}
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 211, 238, 0.05)', border: '1px solid rgba(34, 211, 238, 0.3)', borderRadius: '0.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Overwhelmed by the technical requirements?</p>
                <a 
                  href="https://wa.me/919358022343?text=Hi%20Launchpad%20Bharat,%20I%20just%20generated%20a%20Startup%20Blueprint%20and%20need%20help%20building%20the%20tech!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn" 
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(34, 211, 238, 0.2)', fontSize: '0.95rem' }}
                >
                  Hire Our Code Team (Starting at ₹1000)
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
