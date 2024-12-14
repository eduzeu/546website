import { Router } from "express";
import coffeeShopRoutes from "./location_coffeeShop.js";
import eventsRoutes from "./location_events.js";
import placeRoutes from "./location_place.js";
import wifiRoutes from "./location_wifi.js";

const router = Router()

router.use('/wifi', wifiRoutes);
router.use('/coffeeShop', coffeeShopRoutes);
router.use('/events', eventsRoutes);
router.use('/place', placeRoutes);

export default router;