import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import PartenaireList from "../../components/partenaireList/PartenaireList";

const Partenaire = () => {
  const { createPartenaire } = useAppContext();

  const [formData, setFormData] = useState({
    companyName: "",
    siret: "",
    profession: "",
    contactEmail: "",
    description: "",
  });

  const validateForm = () => {
    const { companyName, siret, profession, contactEmail, description } = formData;
    const siretRegex = /^\d{14}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (companyName.length < 2) {
      toast.error("Nom de l'entreprise invalide.");
      return false;
    }
    if (!siretRegex.test(siret)) {
      toast.error("Le SIRET doit contenir exactement 14 chiffres.");
      return false;
    }
    if (profession.length < 3) {
      toast.error("Veuillez préciser votre secteur d'activité.");
      return false;
    }
    if (!emailRegex.test(contactEmail)) {
      toast.error("Email de contact invalide.");
      return false;
    }
    if (description.length < 20) {
      toast.error("Veuillez décrire brièvement votre projet (min. 20 caractères).");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loadingToast = toast.loading("Envoi de votre candidature...");
    const success = await createPartenaire(formData);
    toast.dismiss(loadingToast);

    if (success) {
      setFormData({
        companyName: "",
        siret: "",
        profession: "",
        contactEmail: "",
        description: "",
      });
    }
  };

  return (
    <div className="bg-gray-100 overflow-hidden">

  {/* HERO SECTION */}
  <section className="relative py-6 sm:py-10 overflow-hidden">

    {/* Background effects */}
    <div className="absolute inset-0">
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-indigo-600/20 blur-[140px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-180px] right-[-120px] w-[500px] h-[500px] bg-blue-500/10 blur-[160px] rounded-full animate-pulse delay-1000"></div>

      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]"></div>
    </div>

    {/* TITLE */}
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 text-center">
      
      <div className="inline-flex items-center gap-3 px-5 bg-white-700 border border-white/10 backdrop-blur-xl text-indigo-300 text-xs sm:text-sm font-semibold tracking-widest uppercase">
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
        Partenariat
      </div>

      <h1 className="mt-2 text-3xl sm:text-5xl lg:text-5xl font-black leading-tight tracking-tight">
        Devenir
        &nbsp;<span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
          Partenaire
        </span>
      </h1>

      <p className="mt-8 text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
        Rejoignez notre réseau et développez votre activité avec une collaboration moderne, fiable et durable.
      </p>
    </div>
  </section>

  {/* CONTENT */}
  <section className="pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12">

      {/* LEFT - BENEFITS */}
      <div className="space-y-8">

        <h2 className="text-3xl sm:text-4xl font-black">
          Pourquoi nous rejoindre ?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {[
            { icon: "bi-graph-up-arrow", title: "Croissance", desc: "Boost visibilité" },
            { icon: "bi-shield-check", title: "Sécurité", desc: "Paiements fiables" },
            { icon: "bi-people", title: "Support", desc: "Équipe dédiée" },
            { icon: "bi-lightning-charge", title: "Rapidité", desc: "Activation rapide" }
          ].map((item, i) => (
            <div
              key={i}
              className="text-center group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 hover:-translate-y-2 transition-all duration-500"
            >
              <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <i className={`bi ${item.icon} text-xl`}></i>
              </div>

              <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
              <p className="text-gray-400 text-sm mt-2">{item.desc}</p>
            </div>
          ))}

        </div>
      </div>

      {/* RIGHT - FORM */}
      <div className="relative">

        <div className="relative overflow-hidden border border-green-100 bg-white/[0.04] backdrop-blur-2xl p-6 sm:p-10">

          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10"></div>

          <form onSubmit={handleSubmit} className="w-full relative z-10 space-y-8">

            <input
              type="text"
              placeholder="Nom de l'entreprise"
              className="w-full p-4 bg-white/5 border border-green-300 focus:border-indigo-500 outline-none"
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              value={formData.companyName}
             
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="SIRET"
                className="w-full p-4 bg-white/5 border border-green-300 focus:border-indigo-500 outline-none"
                onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                value={formData.siret}
              />

              <input
                type="text"
                placeholder="Secteur"
                className="p-4 bg-white/5 border border-green-300 focus:border-indigo-500 outline-none"
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                value={formData.profession}
              />
            </div>

            <input
              type="email"
              placeholder="Email professionnel"
              className="w-full p-4 bg-white/5 border border-green-300 focus:border-indigo-500 outline-none"
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              value={formData.contactEmail}
            />

            <textarea
              rows="4"
              placeholder="Pourquoi nous rejoindre ?"
              className="w-full p-4 bg-white/5 border border-green-300 focus:border-indigo-500 outline-none resize-none"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              value={formData.description}
            />

            <button
              type="submit"
              className="text-white w-full py-4 font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-[1.02] transition-all"
            >
              SOUMETTRE
            </button>

          </form>
        </div>
      </div>

    </div>
  </section>

  <PartenaireList />
</div>
  );
};

export default Partenaire;