import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    message: "",
  });

  const validateForm = () => {
    const { name, email, telephone, message } = formData;

    const nameRegex = /^[a-zA-ZÀ-ÿ]{2,}\s+[a-zA-ZÀ-ÿ]{2,}/;
    const phoneRegex = /^[0-9+ ]{8,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(name)) {
      toast.error("Veuillez entrer votre prénom et nom.");
      return false;
    }

    if (!emailRegex.test(email)) {
      toast.error("Adresse email invalide.");
      return false;
    }

    if (!phoneRegex.test(telephone)) {
      toast.error("Numéro de téléphone invalide.");
      return false;
    }

    if (message.length < 10) {
      toast.error("Votre message est trop court.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const loadingToast = toast.loading("Envoi du message...");

    try {
      const { data } = await axios.post(
        "/api/contact/send",
        formData
      );

      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success(data.message);

        setFormData({
          name: "",
          email: "",
          telephone: "",
          message: "",
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erreur serveur.");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-700">
  

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-16 space-y-4 animate-fadeUp">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-white/5 border border-indigo-100 dark:border-white/10 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-indigo-600 dark:text-indigo-400 uppercase">
              AYACODIA • Future Ready
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Parlons de votre <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-blue-600 bg-clip-text text-transparent italic">
              prochaine victoire.
            </span>
          </h1>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* INFO SIDE (LEFT) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 animate-fadeLeft">
            <div className="p-8 sm:p-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              
              <img
                src="/logo.png"
                alt="AYACODIA"
                className="w-48 sm:w-64 mb-10 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                Transformons vos idées en <span className="text-indigo-500">réalité digitale.</span>
              </h2>

              <div className="space-y-6">
                <a href="mailto:info@ayacodia.com" className="flex items-center gap-4 group/item">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all duration-300">
                    <i className="bi bi-envelope-at-fill text-lg"></i>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Email</p>
                    <p className="text-slate-900 dark:text-white font-medium">info@ayacodia.com</p>
                  </div>
                </a>

                <a href="#" className="flex items-center gap-4 group/item">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all duration-300">
                    <i className="bi bi-geo-alt-fill text-lg"></i>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Localisation</p>
                    <p className="text-slate-900 dark:text-white font-medium leading-tight">52 rue de quercy<br/>91230 Montgeron</p>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* FORM SIDE (RIGHT) */}
          <div className="lg:col-span-7 animate-fadeRight">
            <div className="relative group">
              {/* Outer Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative bg-white border border-slate-200 dark:border-white/5 p-6 sm:p-12 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 ml-1">Nom Complet</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-6 py-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400/50"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 ml-1">Adresse Email</label>
                      <input
                        type="email"
                        placeholder="hello@world.com"
                        className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-6 py-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400/50"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 ml-1">Téléphone</label>
                    <input
                      type="tel"
                      placeholder="+33 6 00 00 00 00"
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-6 py-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400/50"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 ml-1">Détails du projet</label>
                    <textarea
                      rows="5"
                      placeholder="Décrivez vos ambitions..."
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-6 py-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400/50"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full group relative flex items-center justify-center p-0.5 overflow-hidden font-bold transition-all duration-500 active:scale-[0.98]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 group-hover:scale-110 transition-transform duration-500"></span>
                    <span className="relative w-full bg-[#0b0f1a]/10 dark:bg-transparent py-5 rounded-2xl flex items-center justify-center gap-3 text-white tracking-widest text-sm">
                      LANCER LE PROJET
                      <i className="bi bi-rocket-takeoff-fill text-lg group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fadeLeft { animation: fadeLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-fadeRight { animation: fadeRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
      `}</style>
    </section>
  );
};

export default Contact;