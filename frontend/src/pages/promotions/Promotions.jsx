import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Flame, 
  Clock, 
  ArrowRight, 
  Percent, 
  ShoppingBag, 
  Star,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Promotions = () => {
  // Simuler un compte à rebours pour la vente flash
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { h: prev.h, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const promoCards = [
    {
      id: 1,
      title: "Collection Été",
      discount: "-50%",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
      color: "bg-orange-500",
      category: "Mode"
    },
    {
      id: 2,
      title: "Tech & Accessoires",
      discount: "-30%",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
      color: "bg-indigo-600",
      category: "Électronique"
    },
    {
      id: 3,
      title: "Home Decor",
      discount: "-25%",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&q=80&w=800",
      color: "bg-teal-600",
      category: "Maison"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* 1. HERO FLASH SALE - Responsive Flex */}
      <div className="bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-rose-500 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-6 animate-bounce">
                <Flame className="w-4 h-4" /> VENTE FLASH
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight">
                Offres de <br /> <span className="text-rose-500">Printemps !</span>
              </h1>
              <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
                Profitez de réductions exceptionnelles sur plus de 1000 articles. Premier arrivé, premier servi !
              </p>
              
              {/* Countdown Timer */}
              <div className="flex justify-center lg:justify-start gap-4 mb-10">
                {[
                  { label: 'Heures', val: timeLeft.h },
                  { label: 'Min', val: timeLeft.m },
                  { label: 'Sec', val: timeLeft.s }
                ].map((unit, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[80px] border border-white/10">
                    <div className="text-3xl font-black text-white">{unit.val < 10 ? `0${unit.val}` : unit.val}</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{unit.label}</div>
                  </div>
                ))}
              </div>
              
              <Link to="/products" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-black hover:bg-rose-500 hover:text-white transition-all transform hover:scale-105">
                VOIR TOUTES LES PROMOS <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex-1 relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-rose-500/20 blur-3xl rounded-full"></div>
              <img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000" 
                alt="Promotion" 
                className="rounded-[3rem] shadow-2xl border-4 border-white/5 relative z-10 w-full object-cover h-[400px]"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl z-20 hidden md:block">
                <div className="text-rose-500 font-black text-4xl leading-none">Jusqu'à</div>
                <div className="text-slate-900 font-black text-6xl leading-none">-70%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROMO GRID - Grid System Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoCards.map((card) => (
            <div key={card.id} className="relative group overflow-hidden rounded-[2.5rem] bg-white shadow-lg aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
              <img 
                src={card.image} 
                alt={card.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className={`inline-block px-4 py-1 rounded-full text-white text-xs font-bold mb-3 ${card.color}`}>
                  {card.category}
                </span>
                <h3 className="text-2xl font-black text-white mb-2">{card.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-white">{card.discount}</span>
                  <Link to="/products" className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-slate-900 transition-all">
                    <ShoppingBag className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. COUPON SECTION - Mobile friendly banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-indigo-600 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center rotate-12 shadow-xl">
              <Zap className="w-10 h-10 text-indigo-600" />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-white text-2xl md:text-3xl font-black">Bonus Nouveau Client</h4>
              <p className="text-indigo-100">Obtenez 10€ offerts sur votre première commande.</p>
            </div>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-4">
            <code className="text-white font-black text-2xl tracking-widest px-4">FANCY10</code>
            <button 
              onClick={() => {
                navigator.clipboard.writeText("FANCY10");
                alert("Code copié !");
              }}
              className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold hover:bg-teal-400 hover:text-white transition-all shadow-lg"
            >
              COPIER
            </button>
          </div>
        </div>
      </div>

      {/* 4. TRUST BADGES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { icon: <Tag className="text-rose-500" />, t: "Meilleurs Prix", d: "Garantis toute l'année" },
          { icon: <Clock className="text-indigo-500" />, t: "Offres Limitées", d: "Stocks mis à jour" },
          { icon: <Star className="text-orange-400" />, t: "Qualité Premium", d: "Sélection rigoureuse" },
          { icon: <Percent className="text-teal-500" />, t: "Remises Cumulables", d: "Via notre programme fidelité" }
        ].map((badge, i) => (
          <div key={i} className="text-center md:text-left flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
              {badge.icon}
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-sm leading-tight">{badge.t}</h5>
              <p className="text-slate-500 text-xs">{badge.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions;