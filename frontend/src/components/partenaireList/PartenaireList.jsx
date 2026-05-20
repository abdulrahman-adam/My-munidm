import React from "react";

const partenaires = [
  {
    name: "Oumabarar",
    image: "/oumabarar.jpeg",
    url: "https://www.oumabarar.com",
  },
  {
    name: "Wehda",
    image: "/wehda.png",
    url: "https://www.wehda.fr",
  },
  {
    name: "FancyMarcket",
    image: "/fancymarcket.png",
    url: "https://www.fancymarcket.com",
  },
];

const PartenaireList = () => {
  return (
    /* J'ajoute dark:!bg-[#020617] pour écraser ton .dark body de l'index.css */
    <div className="py-4 bg-gray-50 dark:!bg-[#020617] flex flex-col items-center justify-center transition-colors duration-700 ease-in-out">
      {/* Title Section */}
      <div className="text-center mb-6 flex flex-col items-center">
        {/* Le !text-white est CRITIQUE ici pour battre ton .dark h1 !important */}
        <h1 className="text-3xl md:text-3xl font-black uppercase tracking-tighter text-gray-900 dark:!text-white transition-colors duration-500">
          Nos Partenaires
        </h1>
        <div className="w-16 h-1.5 bg-indigo-500 mt-4 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]"></div>
      </div>

      {/* Grid Container */}
      <div className="w-full h-34 max-w-6xl flex flex-wrap justify-center items-center gap-2 sm:gap-4">
        {partenaires.map((p, index) => (
          <a
            key={index}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            /* On force le bg de la carte pour battre le .dark .bg-white de ton CSS */
            className="w-28 h-30 group relative dark:!bg-white/[0.03] rounded-2xl border border-green-100 dark:border-black/10 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col items-center text-center hover:-translate-y-3"
          >
            {/* Logo Container */}
            <div className="w-28 h-30 sm:h-30 flex items-center justify-center bg-gray-50/50 dark:!bg-white/5 rounded-2xl group-hover:bg-white dark:group-hover:bg-indigo-500/10 transition-all duration-500">
              <img
                src={p.image}
                alt={p.name}
                className="w-28 h-28 object-contain grayscale group-hover:grayscale-0 transition-all duration-700 opacity-70 dark:opacity-90 group-hover:opacity-100 dark:brightness-110"
                
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PartenaireList;