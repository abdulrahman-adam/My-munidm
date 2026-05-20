import React, { useState } from "react";

const AccordionItem = ({ title, content, isOpen, onClick }) => {
  return (
    /* MODIFICATION : Bordure adaptative */
    <div className="w-full px-5 border-b border-slate-200 dark:border-white/5 overflow-hidden transition-all duration-500 bg-gray-100">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group transition-all duration-300"
      >
        {/* MODIFICATION : Texte Slate-900 en clair, Gray-200/White en sombre */}
        <span className={`text-lg md:text-xl font-bold transition-all duration-300 ${
          isOpen 
            ? "text-indigo-600 dark:text-indigo-400" 
            : "text-slate-700 dark:text-gray-200 group-hover:text-indigo-500 dark:group-hover:text-white"
        }`}>
          {title}
        </span>
        
        {/* Icone + / - Animée (Les couleurs indigo restent identiques) */}
        <div className={`relative flex items-center justify-center w-6 h-6 transform transition-transform duration-500 ${isOpen ? "rotate-180" : "rotate-0"}`}>
          <div className="absolute w-5 h-[2px] bg-indigo-500 rounded-full"></div>
          <div className={`absolute w-[2px] h-5 bg-indigo-500 rounded-full transition-transform duration-500 ${isOpen ? "rotate-90 opacity-0" : "rotate-0"}`}></div>
        </div>
      </button>

      {/* Contenu avec animation de hauteur fluide */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100 pb-8" : "max-h-0 opacity-0"
        }`}
      >
        {/* MODIFICATION : Texte Slate-600 en clair, Gray-400 en sombre */}
        <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-base md:text-lg max-w-4xl">
          {content}
        </p>
      </div>
    </div>
  );
};

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const questions = [
    {
      title: "Est-ce que vous avez entendu parler de la transformation digitale ?",
      content: "La transformation digitale n'est pas seulement un mot à la mode, c'est une métamorphose complète de votre entreprise. Nous intégrons les technologies numériques dans toutes vos activités pour booster votre efficacité et créer de la valeur pour vos clients.",
    },
    {
      title: "Applications Webs Performance & Scalabilité",
      content: "Nous concevons des applications web sur mesure, robustes et ultra-rapides. De l'architecture cloud au frontend réactif, nous créons des outils puissants qui évoluent avec votre croissance et offrent une expérience utilisateur inégalée.",
    },
    {
      title: "Applications Mobiles iOS & Android",
      content: "Donnez vie à vos idées sur tous les écrans. Nos applications mobiles natives et hybrides combinent design intuitif et performances de pointe pour engager vos utilisateurs où qu'ils soient, 24h/24.",
    },
  ];

  return (
    /* MODIFICATION : Background adaptatif white -> #020617 */
    <section className="w-full mx-auto px-4 sm:px-8 lg:px-12 py-10 bg-gray-100 dark:bg-[#020617] py-2 transition-colors duration-500">
      <div className="w-full">
        {/* Header de la section */}
        <div className="mb-12">
          {/* MODIFICATION : Titre Slate-900 en clair, White en sombre */}
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
            Expertise <span className="text-indigo-600 dark:text-indigo-500">Digitale</span>
          </h2>
          <div className="w-20 h-1.5 bg-indigo-600 rounded-full"></div>
        </div>

        {/* Liste des Accordions */}
        {/* MODIFICATION : Bordure haute adaptative */}
        <div className="w-full flex flex-col border-t border-slate-200 dark:border-white/5">
          {questions.map((item, index) => (
            <AccordionItem
              key={index}
              title={item.title}
              content={item.content}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accordion;