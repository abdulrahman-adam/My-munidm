import Hour from "../models/Hour.js";
import { sequelize } from "../configs/db.js";

// Helper to convert "HH:mm:ss" to total minutes for calculation
const timeToMins = (timeString) => {
    if (!timeString) return 0;
    const [h, m] = timeString.split(':');
    return parseInt(h) * 60 + parseInt(m);
};

export const getStoreStatus = async (req, res) => {
    try {
        const schedule = await Hour.findAll({
            order: [[sequelize.literal(`FIELD(day_of_week, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche')`)]]
        });

        if (schedule.length === 0) {
            return res.json({ status: "INITIALISATION REQUISE", schedule: [] });
        }

        const now = new Date();
        const daysMap = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const todayName = daysMap[now.getDay()];
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const today = schedule.find(s => s.day_of_week === todayName);
        let status = "FERMÉ";
        let message = "";

        if (today && !today.is_closed) {
            const openMins = timeToMins(today.open_time);
            const closeMins = timeToMins(today.close_time);

            if (currentMinutes >= openMins && currentMinutes < closeMins) {
                status = "OUVERT";
                if (closeMins - currentMinutes <= 60) status = "FERMETURE PROCHE";
            } else if (currentMinutes < openMins) {
                // Scenario: It is morning, opening later TODAY
                status = "FERMÉ";
                message = `Ouvre à ${today.open_time.slice(0, 5).replace(':', 'h')}`;
                if (openMins - currentMinutes <= 60) status = "OUVERTURE PROCHE";
            }
        }

        // MIRACLE LOGIC: If still FERMÉ, find the next opening day
        if (status === "FERMÉ" && !message) {
            const todayIndex = schedule.findIndex(s => s.day_of_week === todayName);
            for (let i = 1; i <= 7; i++) {
                const nextDay = schedule[(todayIndex + i) % 7];
                if (!nextDay.is_closed) {
                    const dayLabel = i === 1 ? "demain" : nextDay.day_of_week;
                    message = `Ouvre ${dayLabel} à ${nextDay.open_time.slice(0, 5).replace(':', 'h')}`;
                    break;
                }
            }
        }

        res.json({ success: true, status, message, today, schedule });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const initializeSchedule = async (req, res) => {
    try {
        const count = await Hour.count();
        if (count > 0) return res.status(400).json({ message: "Données déjà présentes" });

        const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        const batch = days.map(day => ({
            day_of_week: day,
            open_time: '10:00:00',
            close_time: '22:00:00',
            is_closed: false
        }));

        await Hour.bulkCreate(batch);
        res.json({ success: true, message: "Calendrier créé avec succès !" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateHours = async (req, res) => {
    try {
        const { day } = req.params;
        await Hour.update(req.body, { where: { day_of_week: day } });
        res.json({ success: true, message: "Mise à jour réussie" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};