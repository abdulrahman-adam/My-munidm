import React, { useState } from 'react';
// import { FileText, scale3D, ShieldAlert, Truck, RotateCcw, CreditCard, Scale } from 'lucide-react';
import { 
  FileText, 
  ShieldAlert, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Scale, 
  ChevronDown,
  Users,
  Globe,
  Award,
  Target,
  Eye
} from 'lucide-react';

const Terms = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: 'obj',
      icon: <FileText className="w-5 h-5" />,
      title: "Objet et Champ d'Application",
      content: "Les présentes Conditions Générales de Vente (CGV) régissent de manière exclusive les relations contractuelles entre WEHADA et toute personne effectuant un achat sur le site. Toute commande implique l'acceptation sans réserve des présentes conditions."
    },
    {
      id: 'price',
      icon: <CreditCard className="w-5 h-5" />,
      title: "Tarifs et Paiement",
      content: "Les prix sont indiqués en Euros (€) toutes taxes comprises (TTC). WEHADA se réserve le droit de modifier ses prix à tout moment. Le paiement est exigible immédiatement à la commande via nos interfaces sécurisées (Stripe, PayPal)."
    },
    {
      id: 'ship',
      icon: <Truck className="w-5 h-5" />,
      title: "Livraison",
      content: "Les produits sont livrés à l'adresse indiquée lors de la commande. Les délais de livraison ne sont donnés qu'à titre indicatif. WEHADA ne pourra être tenu responsable des retards liés aux transporteurs."
    },
    {
      id: 'ret',
      icon: <RotateCcw className="w-5 h-5" />,
      title: "Droit de Rétractation",
      content: "Conformément à la loi, vous disposez d'un délai de 14 jours à compter de la réception de vos produits pour exercer votre droit de rétractation sans avoir à justifier de motifs. Les frais de retour sont à la charge du client."
    },
    {
      id: 'gar',
      icon: <ShieldAlert className="w-5 h-5" />,
      title: "Garanties et Responsabilité",
      content: "Tous nos produits bénéficient de la garantie légale de conformité. Notre responsabilité ne saurait être engagée en cas de mauvaise utilisation du produit ou de dommages indirects liés à l'utilisation du site."
    },
    {
      id: 'law',
      icon: <Scale className="w-5 h-5" />,
      title: "Litiges et Droit Applicable",
      content: "Les présentes conditions sont soumises à la loi française. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire auprès des tribunaux compétents."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de la page */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
            Conditions Générales <span className="text-indigo-600">de Vente</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Dernière mise à jour : 30 Avril 2026. Veuillez lire attentivement nos conditions avant toute transaction sur WEHADA.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* NAVIGATION LATERALE (Visible uniquement sur Desktop) */}
          <aside className="hidden lg:block w-1/4 sticky top-24 h-fit">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-4">Sommaire</p>
              <nav className="space-y-1">
                {sections.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeSection === item.id 
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* CONTENU PRINCIPAL (Adaptatif) */}
          <main className="flex-1 space-y-4">
            {sections.map((section) => (
              <div 
                key={section.id}
                id={section.id}
                className={`bg-white rounded-3xl border transition-all duration-300 ${
                  activeSection === section.id ? 'border-indigo-500 shadow-xl' : 'border-slate-100 shadow-sm'
                }`}
              >
                <button
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${activeSection === section.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {section.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900">{section.title}</h3>
                  </div>
                  <span className={`text-2xl transition-transform ${activeSection === section.id ? 'rotate-180 text-indigo-600' : 'text-slate-300'}`}>
                    ⌄
                  </span>
                </button>

                {activeSection === section.id && (
                  <div className="px-6 md:px-24 pb-8 text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2">
                    <p className="text-lg border-t border-slate-50 pt-6">
                      {section.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            {/* Pied de page des conditions */}
            <div className="mt-12 p-8 bg-indigo-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-bold mb-1">Besoin d'une précision ?</h4>
                <p className="text-indigo-200">Notre équipe juridique répond à vos questions sous 24h.</p>
              </div>
              <a href="/contact" className="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold hover:bg-teal-400 hover:text-white transition-all">
                Nous contacter
              </a>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Terms;