import express from 'express';
import { authenticate} from '../auth/verifyToken.js';
import {getCheckoutSessions} from '../Controllers/bookingController.js';

const router = express.Router();

router.post("/checkout-session/:photographerId", authenticate, getCheckoutSessions);

export default router;