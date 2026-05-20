import React from 'react';
import { useAppContext } from '../../context/AppContext';

const ShopStatus = () => {
    const { shopStatus } = useAppContext();
    const { status, schedule, today, message } = shopStatus;

    // Professional color mapping with glassmorphism touches
    const getStatusTheme = () => {
        switch (status) {
            case 'OUVERT': 
                return 'bg-green-50 text-green-700 border-green-100';
            case 'FERMETURE PROCHE': 
                return 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse';
            case 'OUVERTURE PROCHE': 
                return 'bg-blue-50 text-blue-700 border-blue-100 animate-pulse';
            default: 
                return 'bg-red-50 text-red-700 border-red-100';
        }
    };

    // Sort schedule to put today at the top
    const sortedSchedule = [...schedule].sort((a, b) => {
        if (a.day_of_week === today?.day_of_week) return -1;
        if (b.day_of_week === today?.day_of_week) return 1;
        return 0;
    });

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-10">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row transition-all duration-500 hover:shadow-blue-500/10">
                
                {/* LEFT SIDE: Hero Status (Responsive height/width) */}
                <div className={`lg:w-1/3 p-8 md:p-12 text-center border-b lg:border-b-0 lg:border-r flex flex-col justify-center items-center transition-colors duration-500 ${getStatusTheme()}`}>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className={`h-3 w-3 rounded-full animate-ping ${status.includes('OUVERT') ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-black opacity-60">Status Direct</h2>
                    </div>
                    
                    <p className="text-4xl md:text-6xl lg:text-5xl xl:text-6xl font-black tracking-tighter mb-4 leading-none uppercase">
                        {status}
                    </p>

                    {/* THE MIRACLE ADDITION: Display "Fermé à HHhMM" when OUVERT */}
                    {status === 'OUVERT' && today && (
                        <p className="text-lg md:text-xl font-bold opacity-80 mb-4 tracking-tight">
                            Fermé à {today.close_time.slice(0, 5).replace(':', 'h')}
                        </p>
                    )}
                    
                    {message && (
                        <div className="inline-block px-6 py-2 bg-white/60 backdrop-blur-md rounded-full text-sm md:text-base font-bold shadow-sm border border-current/10">
                            {message}
                        </div>
                    )}

                    {/* UPDATED: Now visible on mobile and uses AM/PM format */}
                    <div className="mt-8 text-xs uppercase tracking-widest font-bold opacity-40">
                        Vérifié à {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                </div>

                {/* RIGHT SIDE: Schedule Grid */}
                <div className="lg:w-2/3 p-6 md:p-10 bg-white">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Calendrier hebdomadaire</h3>
                        <div className="h-[1px] flex-grow ml-6 bg-gray-100"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4">
                        {sortedSchedule.map((item) => {
                            const isToday = item.day_of_week === today?.day_of_week;
                            
                            return (
                                <div 
                                    key={item.day_of_week} 
                                    className={`flex justify-between items-center px-6 py-4 md:py-5 rounded-2xl transition-all duration-300 group ${
                                        isToday 
                                        ? 'bg-gray-900 text-white scale-[1.02] shadow-2xl ring-8 ring-gray-900/5' 
                                        : 'text-gray-500 hover:bg-blue-50/50 hover:text-blue-600'
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className={`text-sm md:text-base font-bold tracking-tight ${isToday ? 'text-white' : 'text-gray-800'}`}>
                                            {item.day_of_week}
                                        </span>
                                        {isToday && (
                                            <span className="text-[10px] uppercase font-black text-blue-400 mt-0.5">
                                                En ce moment
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-right flex flex-col items-end">
                                        <div className={`text-sm md:text-base font-black font-mono ${isToday ? 'text-white' : 'text-gray-900'}`}>
                                            {item.is_closed ? (
                                                <span className={isToday ? 'text-red-300' : 'text-red-400/80'}>FERMÉ</span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    {item.open_time.slice(0, 5).replace(':', 'h')} 
                                                    <span className={`opacity-30 ${isToday ? 'text-white' : 'text-gray-400'}`}>—</span> 
                                                    {item.close_time.slice(0, 5).replace(':', 'h')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop-only Info */}
                    <div className="mt-8 pt-6 border-t border-gray-50 hidden md:flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <span>Horaires mis à jour automatiquement par le système</span>
                        <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                            Serveur Cloud Actif
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopStatus;