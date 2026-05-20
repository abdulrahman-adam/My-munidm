import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const hasClass = document.documentElement.classList.contains("dark");
    console.log("INITIALISATION : Le mode sombre est-il détecté au départ ?", hasClass);
    return hasClass;
  });

  useEffect(() => {
    const root = document.documentElement;
    console.log("CHANGEMENT DETECTÉ : Passage vers mode", isDark ? "SOMBRE" : "CLAIR");

    if (isDark) {
      root.classList.add("dark");
      console.log("DOM : Classe 'dark' ajoutée à <html>");
    } else {
      root.classList.remove("dark");
      console.log("DOM : Classe 'dark' retirée de <html>");
    }

    console.log("CLASSES ACTUELLES SUR HTML :", root.className);
  }, [isDark]);

  return (
    <button
      onClick={() => {
        console.log("BOUTON CLIQUÉ !");
        setIsDark(!isDark);
      }}
      className={`
        relative flex items-center w-16 h-8 rounded-full p-1 
        transition-all duration-500 ease-in-out
        ${isDark ? "bg-[#020617] border border-white/10" : "bg-gray-100 border border-gray-300"}
      `}
      aria-label="Toggle Theme"
    >
      {/* ... reste du code identique ... */}
      <div
        className={`
          relative z-10 flex items-center justify-center w-6 h-6 rounded-full 
          transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isDark ? "translate-x-8 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "translate-x-0 bg-white shadow-md"}
        `}
      >
        {isDark ? <Moon size={14} className="text-white" fill="currentColor" /> : <Sun size={14} className="text-amber-500" fill="currentColor" />}
      </div>
    </button>
  );
};

export default ThemeToggle;