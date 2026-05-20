import React, { useEffect, useState } from "react";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("ayacodia-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000); // Slight delay for professional feel
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice) => {
    localStorage.setItem("ayacodia-cookie-consent", choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="w-full fixed bottom-50 left-0 z-[10000] pointer-events-none bg-fuchsia-300">
      <div className="pointer-events-auto bg-gray-200">
        <div className="w-full bg-fuchsia-300 backdrop-blur-md border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-slideUp">
          <div className="flex flex-col lg:flex-row items-center justify-between p-6 lg:p-8 gap-6">
            
            {/* CONTENT SECTION */}
            <div className="w-full flex-1 space-y-2 text-center lg:text-left">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center justify-center lg:justify-start gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                GESTION DES COOKIES
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-3xl">
                En poursuivant votre navigation, vous acceptez l'utilisation de services tiers pouvant installer des cookies afin d'améliorer 
                votre expérience utilisateur et de nous permettre de mieux comprendre vos besoins. 
                <a href="/politique-cookies" className="text-blue-600 font-medium hover:underline ml-1">
                  En savoir plus
                </a>
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => handleConsent("rejected")}
                className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300 uppercase tracking-wider"
              >
                Personnaliser
              </button>
              
              <button
                onClick={() => handleConsent("accepted")}
                className="w-full sm:w-auto px-10 py-3 text-sm font-bold text-white bg-[#005bb7] hover:bg-[#004a96] shadow-lg shadow-blue-900/20 transition-all duration-300 uppercase tracking-wider"
              >
                Tout Accepter
              </button>
            </div>
          </div>
          
          {/* Subtle Progress Accent */}
          <div className="h-1 w-full bg-gray-100">
            <div className="h-full bg-blue-600 w-full opacity-20"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(100px) scale(0.98); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        .animate-slideUp {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default CookieBanner;