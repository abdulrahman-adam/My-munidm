import React, { useState } from 'react';
import { Phone, MapPin, Clock, X } from 'lucide-react'; 
import ShopStatus from '../shopStatus/ShopStatus';

const Hero = () => {
  const [showStatus, setShowStatus] = useState(false);

  // High-performance miracle class:
  // animate-miracle-zoom: Handles the constant breathing effect
  const iconBaseClass = "flex items-center justify-center aspect-square rounded-full border shadow-lg transition-all duration-500 active:scale-75 hover:rotate-12 animate-miracle-zoom";

  return (
    <div className="md:hidden flex items-center justify-center w-full p-4">
      {/* High-Performance GPU Accelerated Animations */}
      <style>{`
        @keyframes miracle-zoom {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }
        .animate-miracle-zoom {
          animation: miracle-zoom 3s ease-in-out infinite;
          will-change: transform; /* Signals browser to use GPU */
        }
        .delay-v1 { animation-delay: 0.5s; }
        .delay-v2 { animation-delay: 1s; }
      `}</style>

      <div className="flex flex-col gap-8 w-full">
        
        {/* Icon Bar */}
        <div className="grid grid-cols-3 gap-6 place-items-center">
          
          {/* Maps Icon */}
          <a 
            href="https://www.google.com/maps/place/64+Rue+Louis+Blanc,+75010+Paris/..." 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${iconBaseClass} w-10 bg-white border-gray-100`}
          >
            <MapPin size={26} className="text-blue-600" />
          </a>

          {/* Status Toggle Icon (Center Focus) */}
          <button 
            onClick={() => setShowStatus(!showStatus)}
            className={`${iconBaseClass} w-10 delay-v1 ${
              showStatus 
                ? 'bg-red-500 border-gray-900 scale-125' 
                : 'bg-white border-gray-100'
            }`}
          >
            {showStatus ? (
              <X size={26} className="text-white" />
            ) : (
              <Clock size={26} className="text-purple-600" />
            )}
          </button>

          {/* Telephone Icon */}
          <a 
            href="tel:0766422095" 
            className={`${iconBaseClass} w-10 bg-white border-gray-100 delay-v2`}
          >
            <Phone size={26} className="text-green-600"/>
          </a>
        </div>

        {/* Status Component Display */}
        {showStatus && (
          <div className="animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700 ease-out">
            <div className="relative bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden border border-blue-50">
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setShowStatus(false)} 
                  className="p-2 bg-gray-100 rounded-full active:bg-red-500 active:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>
              <ShopStatus />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;