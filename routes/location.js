import { Router } from "express";
import coffeeShopRoutes from "./location_coffeeShop.js";
import wifiRoutes from "./location_wifi.js";

const router = Router()

router.use('/wifi', wifiRoutes);
router.use('/coffeeShop', coffeeShopRoutes);

export default router;