import express from "express";
import { 
    applyForPartnership, 
    getAllPartenaires, 
    updatePartenaireStatus, 
    deletePartenaire 
} from "../controllers/partenaireController.js";
import authSeller from "../middleware/authSeller.js";

const partenaireRouter = express.Router();

// Public: Companies apply here
partenaireRouter.post('/apply', applyForPartnership);

// Protected: Only authenticated sellers/admins can view applications
partenaireRouter.get('/all', authSeller, getAllPartenaires);

// Protected: Update the status (e.g., approve/reject)
partenaireRouter.put('/update-status/:id', authSeller, updatePartenaireStatus);

// Protected: Delete an application
partenaireRouter.delete('/delete/:id', authSeller, deletePartenaire);

export default partenaireRouter;