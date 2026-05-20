import React, { useEffect, useState } from "react";

const useReveal = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return visible;
};

const About = () => {
  const show = useReveal();

  return (
    <div className="bg-[#020617] text-white overflow-hidden">

      {/* HERO */}
      <section className="relative py-28 sm:py-36 text-center overflow-hidden">

        {/* background */}
        <div className="absolute inset-0">
          <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-indigo-600/20 blur-[140px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-180px] right-[-120px] w-[500px] h-[500px] bg-blue-500/10 blur-[160px] rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-12">

          {/* badge */}
          <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-indigo-300 text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-700 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            AYACODIA • À propos
          </div>

          {/* title line 1 */}
          <h1 className={`mt-8 text-5xl sm:text-6xl lg:text-7xl font-black leading-tight transition-all duration-700 delay-100 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            Nous créons des
          </h1>

          {/* title line 2 */}
          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black transition-all duration-700 delay-200 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <span className="block bg-gradient-to-r from-indigo-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              expériences digitales
            </span>
          </h1>

          {/* paragraph */}
          <p className={`mt-8 text-gray-400 text-lg sm:text-xl leading-relaxed transition-all duration-700 delay-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            AYACODIA est une agence digitale spécialisée dans la création de sites web modernes,
            applications performantes et solutions sur mesure pour entreprises ambitieuses.
          </p>

        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {[
            { icon: "bi-lightning-charge", title: "Performance", desc: "Solutions rapides et optimisées" },
            { icon: "bi-shield-check", title: "Sécurité", desc: "Systèmes fiables et modernes" },
            { icon: "bi-stars", title: "Innovation", desc: "Technologies de pointe" }
          ].map((item, i) => (
            <div
              key={i}
              className={`text-center group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 transition-all duration-700 hover:-translate-y-2
                ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
              `}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <i className={`bi ${item.icon} text-xl`}></i>
              </div>

              <h3 className="mt-6 text-2xl font-bold">{item.title}</h3>
              <p className="mt-3 text-gray-400">{item.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* STORY */}
      <section className="py-24 px-4 sm:px-8 lg:px-12">

        <div className={`max-w-5xl mx-auto text-center transition-all duration-700 delay-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

          <h2 className="text-4xl sm:text-5xl font-black">
            Notre histoire
          </h2>

          <p className="mt-8 text-gray-400 text-lg leading-relaxed">
            AYACODIA est née d’une vision simple : rendre le digital accessible et puissant.
            <br /><br />
            Nous créons des solutions qui génèrent de vrais résultats.
          </p>

        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-4 sm:px-8 lg:px-12">

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">

          {[
            { number: "50+", label: "Projets" },
            { number: "20+", label: "Clients" },
            { number: "3+", label: "Années" },
            { number: "100%", label: "Qualité" },
          ].map((item, i) => (
            <div
              key={i}
              className={`rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 transition-all duration-700 hover:-translate-y-2
                ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
              `}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <h3 className="text-4xl font-black text-transparent bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text">
                {item.number}
              </h3>
              <p className="mt-3 text-gray-400">{item.label}</p>
            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-8 lg:px-12">

        <div className={`max-w-5xl mx-auto text-center rounded-[40px] border border-white/10 bg-gradient-to-br from-indigo-600 to-blue-700 p-12 sm:p-16 shadow-[0_20px_80px_rgba(79,70,229,0.4)] transition-all duration-700 delay-500 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

          <h2 className="text-4xl sm:text-5xl font-black">
            Prêt à travailler avec nous ?
          </h2>

          <p className="mt-6 text-white/80 text-lg">
            Transformons votre idée en une solution digitale performante.
          </p>

          <a
            href="/contact"
            className="mt-10 inline-block px-8 py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:scale-105 transition"
          >
            Nous contacter
          </a>

        </div>

      </section>

    </div>
  );
};

export default About;