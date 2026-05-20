import { useState } from "react";

export default function ShortContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative cursor-pointer">
      {/* Floating Call Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center"
      >
        {/* Pulse Rings */}
        <span className="absolute inline-flex h-12 w-12 rounded-full bg-green-500 opacity-30 animate-ping"></span>
        <span className="absolute inline-flex h-10 w-10 rounded-full bg-green-500/40 animate-pulse"></span>

        {/* Main Circle */}
        <div className="relative h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg hover:scale-110 transition duration-300">
          <i class="bi bi-telephone-x text-lg text-white"></i>
        </div>
      </button>

      {/* Dropdown Card */}
      {open && (
        <div   className="
      fixed top-20 left-1/2 -translate-x-1/2
      sm:absolute sm:right-0 sm:left-auto sm:translate-x-0 sm:top-14

      w-72 rounded-2xl border border-slate-200 dark:border-white/10
      bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-2xl
      shadow-2xl p-4 animate-fadeUp z-50
    ">

          {/* Title */}
          <p className="text-xs uppercase tracking-widest text-green-600 font-semibold">
            Contactez-nous
          </p>

          {/* Phone */}
          <a
            href="tel:06 51 49 03 77"
            className="block mt-3 font-bold text-blue-600 dark:text-white hover:text-green-500 transition"
          >
            <i class="bi bi-telephone-x text-blue-600"></i> &nbsp;<span className="underline">06 51 49 03 77</span>
          </a>

          {/* Divider */}
          <div className="my-3 h-px bg-slate-200 dark:bg-white/10"></div>

          {/* Actions */}
          <a
            href="/contact"
            className="block text-sm font-semibold text-indigo-600 hover:underline"
          >
            Aller à la page contact
          </a>

          <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
            Disponible 24/7 pour vos projets
          </p>
        </div>
      )}
    </div>
  );
}