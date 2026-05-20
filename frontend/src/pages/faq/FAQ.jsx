import React, { useState } from 'react';
import { 
  HelpCircle, 
  ShoppingBag, 
  Truck, 
  RefreshCcw, 
  ShieldCheck, 
  Plus, 
  Minus,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openIndex, setOpenIndex] = useState(0);

  const categories = [
    { id: 'general', name: 'Général', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'orders', name: 'Commandes', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'shipping', name: 'Livraison', icon: <Truck className="w-5 h-5" /> },
    { id: 'returns', name: 'Retours', icon: <RefreshCcw className="w-5 h-5" /> },
  ];

  const faqData = {
    general: [
      { q: "Qu'est-ce que WEHADA ?", a: "WEHADA est une marketplace premium proposant une sélection exclusive de produits de haute qualité, rigoureusement sélectionnés pour leur design et leur durabilité." },
      { q: "Les produits sont-ils authentiques ?", a: "Absolument. Nous travaillons directement avec les créateurs et les marques officielles pour garantir l'authenticité de chaque article vendu sur notre plateforme." }
    ],
    orders: [
      { q: "Comment suivre ma commande ?", a: "Dès l'expédition de votre colis, vous recevrez un e-mail contenant un lien de suivi ainsi qu'un numéro de commande pour consulter l'état de votre livraison en temps réel." },
      { q: "Puis-je modifier une commande validée ?", a: "Pour garantir des délais de livraison rapides, les commandes sont traitées presque instantanément. Contactez notre support dans les 30 minutes suivant l'achat pour toute modification." }
    ],
    shipping: [
      { q: "Quels sont les délais de livraison ?", a: "Pour la France métropolitaine, comptez 2 à 4 jours ouvrés. Pour l'international, les délais varient entre 5 et 10 jours selon la destination." },
      { q: "Livrez-vous partout dans le monde ?", a: "Oui, WEHADA livre dans plus de 50 pays. Les frais de port sont calculés automatiquement lors du passage en caisse." }
    ],
    returns: [
      { q: "Quelle est votre politique de retour ?", a: "Vous disposez de 14 jours après réception pour nous retourner un article s'il ne vous convient pas. Le produit doit être dans son emballage d'origine et non utilisé." },
      { q: "Comment se faire rembourser ?", a: "Une fois le retour réceptionné et inspecté par nos équipes, le remboursement est effectué sur votre mode de paiement initial sous 5 à 7 jours ouvrés." }
    ]
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">FAQ</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
            Des questions ? <br className="hidden md:block" /> 
            <span className="text-slate-400">On vous dit tout.</span>
          </h3>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Trouvez rapidement des réponses à vos questions les plus fréquentes. Si vous ne trouvez pas ce que vous cherchez, notre équipe est là pour vous.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation (Desktop) / Tabs (Mobile) */}
          <div className="lg:w-1/3">
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenIndex(0);
                  }}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap min-w-fit lg:w-full ${
                    activeCategory === cat.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Assistance Card */}
            <div className="hidden lg:block mt-8 p-6 bg-slate-900 rounded-[2rem] text-white">
              <div className="bg-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold mb-2">Encore besoin d'aide ?</h4>
              <p className="text-slate-400 text-sm mb-6">Nos experts sont disponibles 7j/7 pour vous accompagner.</p>
              <button className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-indigo-400 hover:text-white transition-all">
                <Link to="/contact">Discuter avec nous</Link>
              </button>
            </div>
          </div>

          {/* FAQ Accordion Content */}
          <div className="lg:w-2/3 space-y-4">
            {faqData[activeCategory].map((item, index) => (
              <div 
                key={index}
                className={`group border rounded-3xl transition-all duration-300 ${
                  openIndex === index ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-100 bg-white'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                >
                  <span className={`text-lg md:text-xl font-bold transition-colors ${
                    openIndex === index ? 'text-indigo-600' : 'text-slate-900'
                  }`}>
                    {item.q}
                  </span>
                  <div className={`p-2 rounded-full transition-all ${
                    openIndex === index ? 'bg-indigo-600 text-white rotate-0' : 'bg-slate-100 text-slate-400 rotate-180'
                  }`}>
                    {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 md:px-8 pb-8 text-slate-600 text-lg leading-relaxed">
                    <div className="pt-4 border-t border-indigo-100">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Safety Badges */}
            <div className="mt-10 flex flex-wrap items-center gap-6 p-6 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <ShieldCheck className="w-5 h-5 text-teal-500" /> Paiement 100% Sécurisé
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Truck className="w-5 h-5 text-indigo-500" /> Livraison Express
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;