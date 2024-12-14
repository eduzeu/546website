import { Router } from "express";
import { fetchCoffeeShops } from "../data/locations.js";

const router = Router();

router.route('/')
  .get(async (req, res) => {
    try {
      const placeOfDay = await fetchCoffeeShops();
      // console.log(placeOfDay)
      res.json(placeOfDay);
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch place of the day.' })
    }
  });

export default router;