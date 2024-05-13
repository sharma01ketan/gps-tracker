import { Router } from "express";
import { createLocation, calculateDistance, closestDistance, addLocation } from "../controllers/location.controller.js";


const router = Router();

router.route("/location").post(createLocation);
router.route('/distance').post(calculateDistance)
router.route('/closest').post(closestDistance)
router.route('/addLocation').post(addLocation)


export default router;
