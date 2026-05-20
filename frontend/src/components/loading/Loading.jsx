import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Loading = () => {
  const { navigate, setCartItems } = useAppContext();
  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const nextUrl = query.get('next');

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        setCartItems({})
        navigate(`/${nextUrl}`)
      }, 3000)
    }
  }, [nextUrl])

  return (
   <div className="min-h-[400px] w-full flex items-center justify-center p-4">
      <div className="relative flex flex-col items-center">
        
        {/* --- DYNAMIC LOADING ICON --- */}
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          {/* Outer Ring - Static subtle border */}
          <div className="absolute inset-0 rounded-full border-[3px] border-blue-50/30"></div>
          
          {/* Middle Ring - Slow rotation */}
          <div className="absolute inset-2 rounded-full border-[3px] border-t-blue-500/40 border-r-transparent border-b-transparent border-l-transparent animate-[spin_3s_linear_infinite]"></div>
          
          {/* Inner Primary Ring - Fast professional spin */}
          <div className="absolute inset-0 rounded-full border-[3px] border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-[spin_0.8s_cubic_bezier(0.4,0,0.2,1)_infinite]"></div>
          
          {/* Central Glow Core */}
          <div className="absolute inset-[35%] bg-blue-600/10 rounded-full blur-xl animate-pulse"></div>
          
          {/* Center Brand Dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
        </div>

        {/* --- TYPOGRAPHY SECTION --- */}
        <div className="mt-8 text-center space-y-2 animate-fadeIn">
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 uppercase italic">
            Ayacodia<span className="text-blue-600 font-black">.</span>
          </h2>
          
          <div className="flex flex-col items-center">
            <p className="text-sm md:text-base font-medium text-slate-600 tracking-wide">
              Initialisation du système
            </p>
            
            {/* Minimalist Progress Bar */}
            <div className="mt-4 w-32 md:w-48 h-[2px] bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-progressMove"></div>
            </div>
            
            <p className="mt-4 text-[10px] md:text-xs text-slate-400 font-semibold uppercase tracking-[0.2em] animate-pulse">
              Sécurisation de la connexion...
            </p>
          </div>
        </div>
      </div>

      {/* --- PREMIUM ANIMATIONS --- */}
      <style>{`
        @keyframes progressMove {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }

        .animate-progressMove {
          animation: progressMove 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default Loading;