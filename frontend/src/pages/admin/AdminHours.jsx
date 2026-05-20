import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const AdminHours = () => {
    const { shopStatus, updateShopHours } = useAppContext();
    const [updatingDay, setUpdatingDay] = useState(null);

    const handleUpdate = async (day, field, value) => {
        setUpdatingDay(day);
        const dayData = shopStatus.schedule.find(s => s.day_of_week === day);
        
        const cleanData = {
            open_time: field === 'open_time' ? value : dayData.open_time,
            close_time: field === 'close_time' ? value : dayData.close_time,
            is_closed: field === 'is_closed' ? value : dayData.is_closed
        };

        await updateShopHours(day, cleanData);
        setUpdatingDay(null);
    };

    return (
        <div className="p-2 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-[2rem] md:rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                
                {/* Responsive Header */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl md:text-3xl font-black tracking-tight">Configuration Business</h2>
                            <p className="text-gray-400 text-xs md:text-sm mt-1 uppercase tracking-widest font-medium">Horaires & Statut en Direct</p>
                        </div>
                        <div className="hidden md:block px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                            <span className="text-[10px] font-bold opacity-60 uppercase block">Serveur</span>
                            <span className="text-xs font-mono text-green-400">● Système Opérationnel</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-4 md:p-0">
                    {/* Desktop Table View (Hidden on Mobile) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] border-b">
                                    <th className="p-6 font-bold">Jour</th>
                                    <th className="p-6 font-bold">Ouverture</th>
                                    <th className="p-6 font-bold">Fermeture</th>
                                    <th className="p-6 font-bold">Aperçu Client</th>
                                    <th className="p-6 font-bold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {shopStatus.schedule.map((item) => (
                                    <RowItem key={item.day_of_week} item={item} handleUpdate={handleUpdate} updatingDay={updatingDay} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View (Hidden on Desktop) */}
                    <div className="md:hidden space-y-4">
                        {shopStatus.schedule.map((item) => (
                            <MobileCard key={item.day_of_week} item={item} handleUpdate={handleUpdate} updatingDay={updatingDay} />
                        ))}
                    </div>
                </div>

                {/* Professional Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">
                        Synchronisation Cloud Activée
                    </p>
                </div>
            </div>
        </div>
    );
};

// Helper for AM/PM format
const formatAMPM = (timeStr) => {
    if (!timeStr) return "";
    let [hours, minutes] = timeStr.split(':');
    hours = parseInt(hours);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
};

// Sub-component for Desktop Rows
const RowItem = ({ item, handleUpdate, updatingDay }) => (
    <tr className="group hover:bg-gray-50/80 transition-all">
        <td className="p-6">
            <span className="font-black text-gray-800 text-lg">{item.day_of_week}</span>
        </td>
        <td className="p-6">
            <input 
                type="time" 
                value={item.open_time.slice(0, 5)}
                onChange={(e) => handleUpdate(item.day_of_week, 'open_time', e.target.value)}
                className="bg-gray-100 border-2 border-transparent focus:border-blue-500 rounded-xl p-2 font-mono font-bold outline-none transition-all"
            />
        </td>
        <td className="p-6">
            <input 
                type="time" 
                value={item.close_time.slice(0, 5)}
                onChange={(e) => handleUpdate(item.day_of_week, 'close_time', e.target.value)}
                className="bg-gray-100 border-2 border-transparent focus:border-blue-500 rounded-xl p-2 font-mono font-bold outline-none transition-all"
            />
        </td>
        <td className="p-6">
            <StatusPreview item={item} />
        </td>
        <td className="p-6 text-center">
            <ToggleButton item={item} updatingDay={updatingDay} handleUpdate={handleUpdate} />
        </td>
    </tr>
);

// Sub-component for Mobile Cards
const MobileCard = ({ item, handleUpdate, updatingDay }) => (
    <div className={`p-5 rounded-3xl border-2 transition-all ${item.is_closed ? 'bg-gray-50 border-gray-100' : 'bg-white border-blue-50 shadow-sm'}`}>
        <div className="flex justify-between items-start mb-4">
            <h3 className="font-black text-xl text-gray-800">{item.day_of_week}</h3>
            <ToggleButton item={item} updatingDay={updatingDay} handleUpdate={handleUpdate} isSmall />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex justify-between">
                    <span>Ouverture</span>
                    <span className="text-blue-500 lowercase">{formatAMPM(item.open_time.slice(0, 5))}</span>
                </label>
                <input 
                    type="time" 
                    value={item.open_time.slice(0, 5)}
                    onChange={(e) => handleUpdate(item.day_of_week, 'open_time', e.target.value)}
                    className="w-full bg-gray-100 rounded-2xl p-3 font-mono font-bold text-sm"
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex justify-between">
                    <span>Fermeture</span>
                    <span className="text-blue-500 lowercase">{formatAMPM(item.close_time.slice(0, 5))}</span>
                </label>
                <input 
                    type="time" 
                    value={item.close_time.slice(0, 5)}
                    onChange={(e) => handleUpdate(item.day_of_week, 'close_time', e.target.value)}
                    className="w-full bg-gray-100 rounded-2xl p-3 font-mono font-bold text-sm"
                />
            </div>
        </div>
        <StatusPreview item={item} />
    </div>
);

// UI Helpers
const StatusPreview = ({ item }) => (
    <div className="flex flex-col gap-1">
        {item.is_closed ? (
            <span className="text-[10px] font-black px-3 py-1 bg-red-100 text-red-600 rounded-full w-fit italic">FERMÉ</span>
        ) : (
            <div className="flex flex-col">
                <span className="text-[10px] font-black px-3 py-1 bg-green-100 text-green-700 rounded-full w-fit">OUVERT</span>
                <span className="text-[10px] text-gray-400 mt-1 font-medium italic">Message : "Ouvre à {item.open_time.slice(0, 5).replace(':', 'h')}"</span>
            </div>
        )}
    </div>
);

const ToggleButton = ({ item, updatingDay, handleUpdate, isSmall = false }) => (
    <button 
        onClick={() => handleUpdate(item.day_of_week, 'is_closed', !item.is_closed)}
        disabled={updatingDay === item.day_of_week}
        className={`relative font-black tracking-tighter transition-all active:scale-95 disabled:opacity-50 ${
            isSmall ? 'px-4 py-2 rounded-xl text-[10px]' : 'px-6 py-2.5 rounded-2xl text-xs'
        } ${item.is_closed ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-gray-900 text-white shadow-lg shadow-gray-200'}`}
    >
        {updatingDay === item.day_of_week ? '...' : (item.is_closed ? 'ACTIVER' : 'DÉSACTIVER')}
    </button>
);

export default AdminHours;