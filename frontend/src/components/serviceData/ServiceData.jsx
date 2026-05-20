import React, { useState } from "react";

// Données des services
const servicesData = [
  {
    id: "web-mobile",
    title: "Applications Web & Web Mobile",
    subtitle: "Performance & Ergonomie",
    description:
      "Nous concevons des applications web et mobiles sur mesure, intuitives et ultra-performantes. Du design responsive à l'architecture fluide, nous optimisons l'expérience utilisateur sur tous les écrans.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    badge: "Incontournable",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    id: "digital-transform",
    title: "Transformation Digitale",
    subtitle: "Conseil & Accompagnement",
    description:
      "Nous accompagnons les entreprises dans leur mutation technologique. Modernisation des processus, audit technique et conduite du changement pour propulser votre business dans l'ère du digital.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    badge: "Stratégie",
    gradient: "from-purple-600 to-indigo-500",
  },
  {
    id: "scale-solutions",
    title: "Ingénierie Système & Architecture",
    subtitle: "Du POS à l'Intelligence Artificielle",
    description:
      "Une expertise unique segmentée selon l'envergure et la maturité de vos projets techniques.",
    hasSubsystems: true,
    gradient: "from-emerald-600 to-teal-500",
  },
];

const subsystems = [
  {
    level: "Petits Systèmes",
    tech: "Applications POS",
    desc: "Gestion d'inventaire, logiciels de point de vente (POS) agiles.",
  },
  {
    level: "Moyens Systèmes",
    tech: "Outils Business",
    desc: "Solutions CRM centralisées et plateformes de gestion RH.",
  },
  {
    level: "Grands Systèmes",
    tech: "Écosystèmes Enterprise",
    desc: "Architectures ERP robustes et infrastructures bancaires sécurisées.",
  },
  {
    level: "Systèmes Avancés",
    tech: "IA & Systèmes Distribués",
    desc: "Modèles prédictifs, Big Data et scalabilité horizontale.",
  },
];

export default function ServicesData() {
  
  const [activeSystem, setActiveSystem] = useState(0);

  return (
    <section className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans selection:bg-cyan-500 selection:text-slate-900 relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none animate-blob" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-[140px] rounded-full pointer-events-none animate-blob animation-delay-2000" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4 animate-fadeUp">
          <span className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Notre Écosystème d'Expertise
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Des services pensés pour votre{" "}
            <span className="underline decoration-cyan-500 decoration-4 underline-offset-8">
              croissance
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 font-light leading-relaxed">
            De l'application mobile ciblée au déploiement d'architectures
            d'entreprise propulsées par l'IA, nous façonnons le futur
            technologique de votre structure.
          </p>
        </div>

        {/* TOP SERVICES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {servicesData
            .filter((s) => !s.hasSubsystems)
            .map((service, index) => (
              <div
                key={service.id}
                className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 hover:border-slate-600 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(34,211,238,0.12)] overflow-hidden animate-cardReveal"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {/* Hover Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700`}
                />

                {/* Floating Blur */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-700" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div
                      className={`p-3.5 rounded-2xl bg-gradient-to-br ${service.gradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                    >
                      {service.icon}
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 bg-slate-700/40 text-slate-300 rounded-full border border-slate-600/30">
                      {service.badge}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {service.subtitle}
                    </span>

                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                      {service.title}
                    </h3>

                    <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* ADVANCED SYSTEM */}
        {servicesData
          .filter((s) => s.hasSubsystems)
          .map((service) => (
            <div
              key={service.id}
              className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

              {/* Header */}
              <div className="mb-8 animate-fadeUp">
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                  {service.subtitle}
                </span>

                <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  {service.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-400 font-light mt-2 max-w-2xl">
                  {service.description}
                </p>
              </div>

              {/* MAIN GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                {/* LEFT MENU => HIDDEN ONLY MOBILE */}
                <div className="hidden sm:flex lg:col-span-5 flex-col gap-3 justify-center">
                  {subsystems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSystem(index)}
                      className={`group relative overflow-hidden w-full text-left p-4 rounded-2xl transition-all duration-500 border flex items-center justify-between ${
                        activeSystem === index
                          ? "bg-gradient-to-r from-slate-800 to-slate-700/50 border-emerald-500/40 shadow-xl shadow-emerald-950/20 translate-x-2 scale-[1.02]"
                          : "bg-transparent border-transparent hover:bg-slate-800/30 hover:border-slate-700/50 text-slate-400 hover:translate-x-1"
                      }`}
                    >
                      {/* Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5" />

                      <div className="space-y-0.5 relative z-10">
                        <p
                          className={`text-xs font-bold uppercase tracking-wider ${
                            activeSystem === index
                              ? "text-emerald-400"
                              : "text-slate-500"
                          }`}
                        >
                          {item.level}
                        </p>

                        <p
                          className={`font-semibold text-base ${
                            activeSystem === index
                              ? "text-white"
                              : "text-slate-300"
                          }`}
                        >
                          {item.tech}
                        </p>
                      </div>

                      <div
                        className={`relative z-10 p-2 rounded-xl transition-all duration-500 ${
                          activeSystem === index
                            ? "bg-emerald-500/20 text-emerald-400 rotate-90 scale-110"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>

                {/* MOBILE MIRACLE UI */}
              
<div className="sm:hidden flex flex-col gap-4">
  {subsystems.map((item, index) => {
    const isOpen = activeSystem === index;

    return (
      <div
        key={index}
        className={`relative overflow-hidden border rounded-3xl transition-all duration-700 ${
          isOpen
            ? "border-emerald-500/40 shadow-[0_10px_40px_rgba(16,185,129,0.18)] bg-slate-900/90"
            : "border-slate-700/40 bg-slate-900/60"
        }`}
      >
        {/* CLICKABLE HEADER */}
        <button
          onClick={() =>
            setActiveSystem(isOpen ? -1 : index)
          }
          className="w-full relative z-10 p-5 text-left"
        >
          {/* Animated Background */}
          <div
            className={`absolute inset-0 transition-all duration-700 ${
              isOpen
                ? "opacity-100 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent"
                : "opacity-0"
            }`}
          />

          {/* Glow Effect */}
          <div
            className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl transition-all duration-700 ${
              isOpen
                ? "bg-emerald-500/20 opacity-100"
                : "opacity-0"
            }`}
          />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-[0.25em] ${
                  isOpen ? "text-emerald-400" : "text-slate-500"
                }`}
              >
                {item.level}
              </p>

              <h4
                className={`mt-2 text-lg font-bold transition-all duration-500 ${
                  isOpen ? "text-white" : "text-slate-300"
                }`}
              >
                {item.tech}
              </h4>
            </div>

            <div
              className={`p-3 rounded-2xl transition-all duration-700 ${
                isOpen
                  ? "bg-emerald-500/20 text-emerald-400 rotate-180 scale-110"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              <svg
                className="w-5 h-5 transition-all duration-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </button>

        {/* EXPANDABLE CONTENT (SMOOTH ACCORDION FIX) */}
        {/* EXPANDABLE CONTENT - FIXED STABLE VERSION */}
<div
  className={`grid transition-all duration-700 ease-in-out ${
    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
  }`}
>
  <div className="overflow-hidden">
    <div className="px-5 pb-5">
      {/* STATUS */}
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Architecture active
      </div>

      {/* DESCRIPTION */}
      <p className="mt-5 text-sm text-slate-400 leading-relaxed animate-fadeSwitch">
        {item.desc}
      </p>

      {/* FOOTER */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>STATUS: OPTIMIZED</span>
        <span>SCALE: 0{index + 1} // NEXT_GEN</span>
      </div>
    </div>
  </div>
</div>
      </div>
    );
  })}
</div>

                {/* RIGHT PANEL LARGE/TABLET */}
                <div className="hidden sm:flex lg:col-span-7 bg-slate-900/60 border border-slate-700/40 rounded-2xl p-6 sm:p-8 flex-col justify-between relative overflow-hidden min-h-[280px]">

                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />

                  {/* Floating Circle */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full animate-float" />

                  <div
                    key={activeSystem}
                    className="animate-fadeSwitch relative z-10"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Architecture active
                    </div>

                    <h4 className="mt-5 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {subsystems[activeSystem]?.tech}
                    </h4>

                    <p className="mt-4 text-sm sm:text-base text-slate-400 font-light leading-relaxed max-w-xl">
                     {subsystems[activeSystem]?.desc}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>STATUS: OPTIMIZED</span>
                    <span>SCALE: 0{activeSystem + 1} // NEXT_GEN</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

      </div>

      {/* ANIMATIONS */}
      <style jsx="true">{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardReveal {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes fadeSwitch {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-fadeUp {
          animation: fadeUp 1s ease forwards;
        }

        .animate-cardReveal {
          opacity: 0;
          animation: cardReveal 1s ease forwards;
        }

        .animate-blob {
          animation: blob 12s infinite ease-in-out;
        }

        .animate-fadeSwitch {
          animation: fadeSwitch 0.7s ease;
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}