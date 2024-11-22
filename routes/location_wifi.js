import { Router } from "express";
import { getWifiLocations } from "../data/locations.js";

const router = Router()

router.route('/')
    .get(async (req, res) => {
        try {
            const wifiLocations = await getWifiLocations();
            res.json(wifiLocations);
        } catch (e) {
            res.status(500).json({ error: 'Failed to fetch Wi-Fi locations' });
        }
    });

export default router;