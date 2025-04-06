import express from 'express';
import { 
    updatePhotographer, 
    deletePhotographer, 
    getAllPhotographer, 
    getSinglePhotographer,
    getPhotographerProfile 
} from '../Controllers/photographerController.js';
import { authenticate, restrict } from '../auth/verifyToken.js';
import reviewRouter from './review.js';

const router = express.Router();

//nested routes
router.use("/:photographerId/reviews", reviewRouter);

router.put("/:id",authenticate, restrict(["photographer"]), updatePhotographer);
router.delete("/:id",authenticate, restrict(["photographer"]), deletePhotographer);
router.get("/", getAllPhotographer);
router.get("/:id", getSinglePhotographer);
router.get("/profile/me",authenticate, restrict(["photographer"]), getPhotographerProfile);

export default router;