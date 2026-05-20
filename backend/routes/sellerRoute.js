import express from "express";
import {getSellerProfile, isSellerAuth, sellerLogin, sellerLogout } from "../controllers/sellerController.js";
import authSeller from "../middleware/authSeller.js";

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/is-auth',authSeller,isSellerAuth);
// NEW: This is the route your AppContext is calling
sellerRouter.get('/profile', authSeller, getSellerProfile);

sellerRouter.get('/logout', sellerLogout);

export default sellerRouter;