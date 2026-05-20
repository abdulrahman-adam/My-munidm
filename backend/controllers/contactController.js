

import Contact from "../models/Contact.js";

export const saveMessage = async (req, res) => {
    try {
        const { name, email, telephone, message } = req.body;

        // Basic backend check
        if (!name || !email || !telephone || !message) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const newMessage = await Contact.create({ name, email, telephone, message });
        
        res.json({ success: true, message: "Message sent successfully!", data: newMessage });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};




// Get all contact messages
export const getAllContacts = async (req, res) => {
    try {
        // Fetch all records, ordered by newest first
        const contacts = await Contact.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, data: contacts });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a contact message by ID
export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        // Perform the deletion
        const deletedCount = await Contact.destroy({
            where: { id: id }
        });

        if (deletedCount === 0) {
            return res.json({ success: false, message: "Message not found" });
        }

        res.json({ success: true, message: "Message deleted successfully!" });
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};