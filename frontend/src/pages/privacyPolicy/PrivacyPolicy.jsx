import React from 'react';
import { ShieldCheck, Mail, Lock, UserCheck, EyeOff } from 'lucide-react'; // Optionnel : icônes pour le style

const PrivacyPolicy = () => {
  const lastUpdate = "29 Avril 2026";

  return (
    <div className="bg-slate-50 min-h-screen py-6 md:py-12 lg:py-20 px-4">
      {/* Container principal avec largeur max pour grands écrans */}
      <div className="max-w-screen-xl mx-auto">
        
        <article className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          
          {/* HEADER : Adaptatif de Mobile à Desktop */}
          <header className="bg-slate-900 p-6 md:p-12 lg:p-16 text-center md:text-left">
            <div className="inline-flex items-center justify-center p-3 bg-teal-500/20 rounded-xl mb-4">
              <ShieldCheck className="text-teal-400 w-8 h-8" />
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Politique de Confidentialité
            </h1>
            <p className="mt-4 text-slate-400 text-sm md:text-base lg:text-lg">
             WEHADA • Mise à jour : {lastUpdate}
            </p>
          </header>

          {/* CORPS DE TEXTE */}
          <div className="p-6 md:p-12 lg:p-16">
            
            {/* Introduction - Texte plus large sur Desktop */}
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-4xl italic">
              "Votre confiance est notre priorité. Nous nous engageons à protéger vos données personnelles avec les standards de sécurité les plus élevés."
            </p>

            <div className="h-px bg-slate-100 my-8 md:my-12" />

            {/* GRILLE DE SECTIONS : 1 col sur mobile, 2 cols sur large tablette/desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              
              {/* Section 01 */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-teal-600 font-bold uppercase tracking-wider text-sm">
                  <UserCheck size={20} />
                  <span>01. Responsable</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">Qui traite vos données ?</h2>
                <p className="text-slate-600 leading-relaxed">
                  Le traitement est assuré par <strong>WEHADA</strong>. Pour toute question, notre délégué à la protection des données (DPO) est joignable directement à : 
                  <a href="mailto:WEHADA.paris@gmail.com" className="block mt-2 text-teal-600 hover:underline font-medium">WEHADA.paris@gmail.com</a>
                </p>
              </section>

              {/* Section 02 */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-teal-600 font-bold uppercase tracking-wider text-sm">
                  <EyeOff size={20} />
                  <span>02. Collecte</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">Quelles données collectons-nous ?</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <li className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Identité & Livraison
                  </li>
                  <li className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Email & Téléphone
                  </li>
                  <li className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Historique d'achat
                  </li>
                  <li className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Cookies de session
                  </li>
                </ul>
              </section>

              {/* Section 03 */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-teal-600 font-bold uppercase tracking-wider text-sm">
                  <Lock size={20} />
                  <span>03. Sécurité</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">Paiements & Chiffrement</h2>
                <p className="text-slate-600">
                  Nous utilisons le protocole <strong>SSL/TLS</strong>. Vos informations bancaires ne transitent jamais par nos serveurs, elles sont gérées par des prestataires certifiés (Stripe/PayPal) via un chiffrement de bout en bout.
                </p>
              </section>

              {/* Section 04 */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-teal-600 font-bold uppercase tracking-wider text-sm">
                  <ShieldCheck size={20} />
                  <span>04. Vos Droits</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">Contrôle total (RGPD)</h2>
                <p className="text-slate-600">
                  Vous avez le droit de modifier, demander la portabilité ou la suppression totale de vos données. Envoyez simplement "SUPPRESSION" par mail pour un traitement sous 48h.
                </p>
              </section>

            </div>

            {/* BANDEAU CONTACT FINAL : Très visuel sur desktop */}
            <footer className="mt-16 md:mt-24 p-8 bg-slate-900 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold">Besoin d'aide supplémentaire ?</h3>
                <p className="text-slate-400 mt-1">Notre équipe juridique est à votre écoute.</p>
              </div>
              <a 
                href="mailto:WEHADA.paris@gmail.com" 
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
              >
                <Mail size={18} />
                Contactez-nous
              </a>
            </footer>

          </div>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;