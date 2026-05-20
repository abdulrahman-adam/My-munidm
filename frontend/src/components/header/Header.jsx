import ServicesData from "../serviceData/ServiceData";

export default function Header() {
  const services = [
    {
      title: "Applications Web",
      description:
        "Création de plateformes modernes, rapides et sécurisées adaptées à votre activité.",
      icon: "bi-window",
    },
    {
      title: "Applications Mobile",
      description:
        "Applications Android et iOS performantes avec expérience utilisateur premium.",
      icon: "bi-phone",
    },
    {
      title: "E-Commerce",
      description:
        "Boutiques en ligne professionnelles optimisées pour les ventes et la croissance.",
      icon: "bi-cart3",
    },
    {
      title: "UI / UX Design",
      description:
        "Interfaces élégantes et intuitives pensées pour vos utilisateurs.",
      icon: "bi-palette",
    },
  ];

  const stats = [
    { number: "50+", label: "Projets réalisés" },
    { number: "24/7", label: "Support & assistance" },
    { number: "100%", label: "Responsive design" },
    { number: "99%", label: "Clients satisfaits" },
  ];

  return (
    <div className="bg-gray-100 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500 overflow-hidden">
      <div className="mt-12 flex justify-center">
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl text-indigo-600 dark:text-indigo-300 text-xs sm:text-sm font-semibold tracking-widest uppercase animate-slideTop">
          <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse"></span>
          AYACODIA • Agence Digitale
        </div>
      </div>
      {/* HERO SECTION */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT */}

          {/* LEFT (UPDATED TO MATCH RIGHT DESIGN SYSTEM) */}
<div className="relative flex justify-center items-center w-full animate-fadeUp">

  {/* Glow Effect (same as RIGHT) */}
  <div className="absolute w-[260px] sm:w-[320px] lg:w-[380px] h-[260px] sm:h-[320px] lg:h-[380px] bg-gradient-to-r from-indigo-500/20 via-blue-500/10 to-violet-500/20 blur-3xl rounded-full animate-pulse"></div>

  {/* Main Card (same structure as RIGHT) */}
  <div className="relative w-full max-w-md lg:max-w-lg group">

    {/* Gradient Border */}
    <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 opacity-60 blur-sm group-hover:opacity-100 transition duration-500"></div>

    <div className="relative overflow-hidden border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-2xl shadow-[0_10px_60px_rgba(0,0,0,0.15)] p-4 sm:p-6">

      {/* Header (converted to RIGHT style system) */}
      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-[11px] sm:text-xs uppercase tracking-[3px] text-indigo-500 font-semibold">
            AYACODIA Identity
          </p>

          <h3 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
            Créons votre
            <span className="block text-indigo-600 dark:text-indigo-400">
              futur digital ensemble
            </span>
          </h3>

          <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-600 dark:text-gray-400 max-w-sm">
            Nous accompagnons les entreprises dans la conception de solutions digitales modernes :
            web, mobile, e-commerce et systèmes intelligents.
          </p>
        </div>

        {/* Icon (same RIGHT style) */}
        <div className="min-w-[52px] h-[52px] sm:min-w-[60px] sm:h-[60px] rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl">
          <span className="text-xl sm:text-2xl">🚀</span>
        </div>

      </div>

      {/* Stats (same RIGHT style system) */}
      <div className="grid grid-cols-3 gap-3 mt-6">

        <div className="rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 sm:p-4 text-center hover:scale-105 transition duration-300">
          <h4 className="text-lg sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
            Vision
          </h4>
          <p className="text-[11px] sm:text-xs mt-1 text-slate-500 dark:text-gray-400">
            Stratégie
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 sm:p-4 text-center hover:scale-105 transition duration-300">
          <h4 className="text-lg sm:text-2xl font-black text-blue-600 dark:text-blue-400">
            Design
          </h4>
          <p className="text-[11px] sm:text-xs mt-1 text-slate-500 dark:text-gray-400">
            UI/UX
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 sm:p-4 text-center hover:scale-105 transition duration-300">
          <h4 className="text-lg sm:text-2xl font-black text-violet-600 dark:text-violet-400">
            Build
          </h4>
          <p className="text-[11px] sm:text-xs mt-1 text-slate-500 dark:text-gray-400">
            Dev
          </p>
        </div>

      </div>

      {/* Footer (same RIGHT CTA system) */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">

        <button className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition duration-300">
          <a href="/partenaire">Devenir Partenaire</a>
        </button>

        <button className="flex-1 py-3 border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-white/10 transition duration-300">
          <a href="/about">À propos</a>
        </button>

      </div>

    </div>
  </div>
</div>

          {/* RIGHT */}
          <div className="relative flex justify-center items-center w-full animate-fadeLeft">
            {/* Glow Effect */}
            <div className="absolute w-[260px] sm:w-[320px] lg:w-[380px] h-[260px] sm:h-[320px] lg:h-[380px] bg-gradient-to-r from-indigo-500/20 via-blue-500/10 to-violet-500/20 blur-3xl rounded-full animate-pulse"></div>

            {/* Main Card */}
            <div className="relative w-full max-w-md lg:max-w-lg group">
              {/* Gradient Border */}
              <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 opacity-60 blur-sm group-hover:opacity-100 transition duration-500"></div>

              <div className="relative overflow-hidden border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-2xl shadow-[0_10px_60px_rgba(0,0,0,0.15)] p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] sm:text-xs uppercase tracking-[3px] text-indigo-500 font-semibold">
                      Digital Experience
                    </p>

                    <h3 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      Solutions digitales
                      <span className="block text-indigo-600 dark:text-indigo-400">
                        modernes & intelligentes
                      </span>
                    </h3>

                    <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-600 dark:text-gray-400 max-w-sm">
                      Création de plateformes web, applications mobiles,
                      systèmes e-commerce et solutions innovantes adaptées aux
                      entreprises modernes.
                    </p>
                  </div>

                  {/* Icon */}
                  <div className="min-w-[52px] h-[52px] sm:min-w-[60px] sm:h-[60px] rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl">
                    <span className="text-xl sm:text-2xl">🚀</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 sm:p-4 text-center hover:scale-105 transition duration-300">
                    <h4 className="text-lg sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                      +10
                    </h4>
                    <p className="text-[11px] sm:text-xs mt-1 text-slate-500 dark:text-gray-400">
                      Projets
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 sm:p-4 text-center hover:scale-105 transition duration-300">
                    <h4 className="text-lg sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                      24/7
                    </h4>
                    <p className="text-[11px] sm:text-xs mt-1 text-slate-500 dark:text-gray-400">
                      Support
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 sm:p-4 text-center hover:scale-105 transition duration-300">
                    <h4 className="text-lg sm:text-2xl font-black text-violet-600 dark:text-violet-400">
                      98%
                    </h4>
                    <p className="text-[11px] sm:text-xs mt-1 text-slate-500 dark:text-gray-400">
                      Satisfaction
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition duration-300">
                    <a href="/contact">Commencer un projet</a>
                  </button>

                  <button className="flex-1 py-3 border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-white/10 transition duration-300">
                    <a href="/services">Voir les services</a>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesData />
      {/* SERVICES */}
      <hr className="border-slate-200 dark:border-white/100" />

      <section className="relative py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-[0.3em] text-sm animate-slideTop">
              Nos Services
            </span>

            <h2 className="mt-2 text-xl sm:text-3xl font-black leading-tight text-slate-900 dark:text-white animate-fadeDelay">
              Des solutions digitales
              <span className="block text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 to-blue-400 bg-clip-text">
                pensées pour votre croissance.
              </span>
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] backdrop-blur-xl p-8 hover:-translate-y-3 hover:scale-[1.03] transition-all duration-700 shadow-sm dark:shadow-none animate-cardReveal"
                style={{
                  animationDelay: `${index * 0.25}s`,
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 dark:from-indigo-500/10 dark:to-blue-500/10 transition duration-700"></div>

                <div className="text-center relative z-10 flex flex-col items-center">
                  {/* ICON */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition duration-500 animate-iconFloat">
                    <i
                      className={`bi ${service.icon} text-white text-2xl leading-none`}
                    ></i>
                  </div>

                  {/* TITLE */}
                  <h3 className="mt-8 text-2xl font-black text-slate-900 dark:text-white">
                    {service.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mt-5 text-slate-600 dark:text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full pb-24 mx-auto px-4 sm:px-8 lg:px-12">
        <div className="w-full max-w-7xl mx-auto relative overflow-hidden border border-white/10 bg-gradient-to-br from-blue-100 to-blue-700 p-4 sm:p-16 text-center shadow-[0_20px_80px_rgba(79,70,229,0.4)]">
          <div className="w-full absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px] animate-gridMove"></div>

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black leading-tight text-white animate-textReveal">
              Vous avez un projet ?
            </h2>

            <p className="mt-8 text-white/80 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed animate-fadeDelay">
              Créons ensemble une solution digitale puissante qui transforme vos
              idées en résultats concrets.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">
              <a
                href="/contact"
                className="px-8 py-5 bg-white text-indigo-700 font-black hover:scale-105 transition-all duration-500 shadow-xl animate-btnPop"
              >
                Nous contacter
              </a>

              <a
                href="https://abdulrahman-adam.com"
                className="px-8 py-5 border border-white/20 bg-white/10 backdrop-blur-xl text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-500 animate-btnPop2"
              >
                Voir nos réalisations
              </a>
            </div>
          </div>
        </div>
      </section>

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

        @keyframes fadeRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        @keyframes cardReveal {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes serviceMove {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes iconFloat {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes textReveal {
          from {
            opacity: 0;
            transform: translateY(20px);
            letter-spacing: 10px;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            letter-spacing: 0;
          }
        }

        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes gridMove {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(60px);
          }
        }

        @keyframes slideTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeDelay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes btnPop {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeUp {
          animation: fadeUp 1s ease forwards;
        }

        .animate-fadeRight {
          animation: fadeRight 1s ease forwards;
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 12s infinite ease-in-out;
        }

        .animate-cardReveal {
          opacity: 0;
          animation: cardReveal 1s ease forwards;
        }

        .animate-serviceMove {
          animation: serviceMove 4s ease-in-out infinite;
        }

        .animate-iconFloat {
          animation: iconFloat 3s ease-in-out infinite;
        }

        .animate-textReveal {
          animation: textReveal 1s ease forwards;
        }

        .animate-gradientMove {
          animation: gradientMove 6s ease infinite;
        }

        .animate-gridMove {
          animation: gridMove 10s linear infinite;
        }

        .animate-slideTop {
          animation: slideTop 1s ease forwards;
        }

        .animate-fadeDelay {
          animation: fadeDelay 2s ease forwards;
        }

        .animate-btnPop {
          animation: btnPop 1s ease forwards;
        }

        .animate-btnPop2 {
          animation: btnPop 1.4s ease forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @media (max-width: 768px) {
          .animate-serviceMove {
            animation-duration: 3s;
          }

          .animate-float {
            animation-duration: 4s;
          }
        }
      `}</style>
    </div>
  );
}
