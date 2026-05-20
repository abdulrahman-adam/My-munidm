import express from 'express';
import { getStoreStatus, initializeSchedule, updateHours } from '../controllers/hourController.js';
import authSeller from '../middleware/authSeller.js';

const hourRouter = express.Router();

hourRouter.post('/init', initializeSchedule);
hourRouter.get('/status', getStoreStatus);
hourRouter.put('/update/:day', authSeller, updateHours);

export default hourRouter;