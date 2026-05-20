import React from 'react';
import { 
  Truck, 
  Globe, 
  Zap, 
  ShieldCheck, 
  PackageCheck, 
  MapPin, 
  Clock, 
  Headphones 
} from 'lucide-react';

const Shipping = () => {
  const shippingMethods = [
    {
      id: 1,
      title: "Livraison Standard",
      time: "3 - 5 jours ouvrés",
      price: "4,90 €",
      description: "Idéal pour vos achats quotidiens. Suivi complet inclus.",
      icon: <Truck className="w-6 h-6" />,
      tag: "Populaire"
    },
    {
      id: 2,
      title: "Livraison Express",
      time: "24h - 48h",
      price: "9,90 €",
      description: "Commandez avant midi, recevez demain. Priorité maximale.",
      icon: <Zap className="w-6 h-6" />,
      tag: "Rapide"
    },
    {
      id: 3,
      title: "Point Relais",
      time: "3 - 4 jours ouvrés",
      price: "Gratuit dès 50€",
      description: "Plus de 10 000 points de retrait disponibles partout en France.",
      icon: <MapPin className="w-6 h-6" />,
      tag: "Éco"
    }
  ];

  const steps = [
    { title: "Préparation", desc: "Votre commande est emballée avec soin sous 24h.", icon: <PackageCheck /> },
    { title: "Expédition", desc: "Remise au transporteur avec votre numéro de suivi.", icon: <Truck /> },
    { title: "En transit", desc: "Voyage sécurisé vers votre destination locale.", icon: <Globe /> },
    { title: "Livraison", desc: "Remise en main propre ou en boîte aux lettres.", icon: <ShieldCheck /> }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-slate-900 py-16 md:py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
          Livraison <span className="text-indigo-400">&</span> Suivi
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Nous expédions vos envies dans le monde entier, avec rapidité et une sécurité totale.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        {/* Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {shippingMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 hover:border-indigo-500 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-slate-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {method.icon}
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                  {method.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{method.title}</h3>
              <p className="text-slate-500 text-sm mb-4 leading-relaxed">{method.description}</p>
              <div className="flex items-baseline gap-2 mt-auto pt-4 border-t border-slate-50">
                <span className="text-2xl font-black text-slate-900">{method.price}</span>
                <span className="text-slate-400 text-sm font-medium">/ {method.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Process */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Comment ça marche ?</h2>
            <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {steps.map((step, idx) => (
                <div key={idx} className="text-center group">
                  <div className="w-16 h-16 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 group-hover:border-indigo-500 group-hover:text-indigo-600 transition-all shadow-md">
                    {step.icon}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-slate-500 text-sm px-4">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ & Support Section */}
        <div className="bg-indigo-50 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Un problème avec votre colis ?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">Suivi 24h/24</h5>
                  <p className="text-slate-600 text-sm">Accédez à votre espace client pour voir l'emplacement précis de votre commande.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Headphones className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">Support Dédié</h5>
                  <p className="text-slate-600 text-sm">Notre équipe logistique vous répond en moins de 2 heures en cas de retard.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl">
              <h4 className="font-bold text-slate-900 mb-4">Vérifier mon colis</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="N° de suivi (ex: FM-987654)" 
                  className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors">
                  Tracer
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center italic">
                * Le numéro de suivi se trouve dans votre e-mail de confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;