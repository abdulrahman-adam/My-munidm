import express from "express";
import { deleteContact, getAllContacts, saveMessage } from "../controllers/contactController.js";
import authSeller from "../middleware/authSeller.js";

const contactRouter = express.Router();

contactRouter.post('/send', saveMessage);
// GET: Retrieve all contact messages
contactRouter.get('/all', authSeller, getAllContacts);

// DELETE: Remove a message by ID
// Note: We use :id as a URL parameter
contactRouter.delete('/delete/:id', authSeller, deleteContact);

export default contactRouter;