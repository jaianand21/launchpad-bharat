import React from 'react';

const Leadership = () => {
  const founders = [
    {
      header: "LEADERSHIP",
      title: "Meet the ",
      titleGradient: "Founder",
      emoji: "👨‍💻",
      name: "Jai Anand",
      role: "Founder, CEO & Lead Developer",
      quote: "Launchpad Bharat was born out of a simple vision: To democratize startup building for every Indian creator. Whether you're in a metro or a tier-3 city, budget should never stop a great idea. We build the tools, you build the future."
    },
    {
      header: "LEADERSHIP",
      title: "Meet the ",
      titleGradient: "Co-Founder",
      emoji: "🚀",
      name: "Abhay Bansal",
      role: "Co-Founder & Head of Strategy",
      quote: "Launchpad Bharat thrives on collaboration. We combine technical excellence with strategic vision to empower India's next generation of entrepreneurs. Together, we make startup success accessible to all."
    }
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {founders.map((founder, index) => (
          <div 
            key={index}
            className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 border border-slate-800 hover:border-slate-700 transition-all duration-300 text-center shadow-2xl flex flex-col items-center"
          >
            <p className="text-cyan-400 text-xs tracking-widest uppercase font-bold mb-2">
              {founder.header}
            </p>
            <h2 className="text-4xl font-bold text-white mb-8">
              {founder.title}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {founder.titleGradient}
              </span>
            </h2>
            
            {/* Avatar with Gradient Border */}
            <div className="relative p-[4px] rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 w-24 h-24 mb-4">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl">
                {founder.emoji}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mt-4">
              {founder.name}
            </h3>
            <p className="text-cyan-400 font-medium">
              {founder.role}
            </p>
            <p className="text-slate-400 text-sm max-w-md mx-auto mt-4 leading-relaxed italic">
              "{founder.quote}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Leadership;
