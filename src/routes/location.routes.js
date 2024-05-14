import { Router } from "express";
import { createLocation, calculateDistance, closestDistance, addLocation, allLocations, getLocationById } from "../controllers/location.controller.js";


const router = Router();

router.route("/location").post(createLocation);
router.route('/distance').post(calculateDistance)
router.route('/closest').post(closestDistance)
router.route('/addLocation').post(addLocation)
router.route('/allLocations').post(allLocations)
router.route("/:locationId").get(getLocationById);


export default router;
