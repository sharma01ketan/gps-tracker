import { Router } from "express";
import { createLocation, calculateDistance, closestDistance } from "../controllers/location.controller.js";


const router = Router();

router.route("/location").post(createLocation);
router.route('/distance').post(calculateDistance)
router.route('/closest').post(closestDistance)


export default router;
