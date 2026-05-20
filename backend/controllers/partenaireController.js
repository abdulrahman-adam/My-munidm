import Partenaire from "../models/Partenaire.js";

// Create a new partnership application
export const applyForPartnership = async (req, res) => {
    try {
        const { companyName, siret, profession, contactEmail, description } = req.body;

        // Basic backend validation
        if (!companyName || !siret || !profession || !contactEmail) {
            return res.json({ success: false, message: "Missing required partnership details" });
        }

        // SIRET format check (14 digits)
        if (siret.length !== 14) {
            return res.json({ success: false, message: "Invalid SIRET number. It must be 14 digits." });
        }

        const newApplication = await Partenaire.create({ 
            companyName, 
            siret, 
            profession, 
            contactEmail, 
            description 
        });
        
        res.json({ 
            success: true, 
            message: "Application submitted successfully! We will review your request.", 
            data: newApplication 
        });
    } catch (error) {
        console.error("Error creating partnership:", error);
        // Handle unique constraint error for SIRET
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.json({ success: false, message: "A company with this SIRET is already registered." });
        }
        res.json({ success: false, message: error.message });
    }
};

// Get all partnership applications
export const getAllPartenaires = async (req, res) => {
    try {
        const partenaires = await Partenaire.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, data: partenaires });
    } catch (error) {
        console.error("Error fetching partners:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update application status (Approve or Reject)
export const updatePartenaireStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // e.g., 'approved' or 'rejected'

        const [updated] = await Partenaire.update({ status }, {
            where: { id: id }
        });

        if (updated === 0) {
            return res.json({ success: false, message: "Partner application not found" });
        }

        res.json({ success: true, message: `Status updated to ${status} successfully!` });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a partnership record
export const deletePartenaire = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCount = await Partenaire.destroy({
            where: { id: id }
        });

        if (deletedCount === 0) {
            return res.json({ success: false, message: "Partner application not found" });
        }

        res.json({ success: true, message: "Application deleted successfully!" });
    } catch (error) {
        console.error("Error deleting partner:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};