import { Router } from "express";
import { getPlaceOfTheDay } from "../data/locations.js";

const router = Router();

router.route('/')
  .get(async (req, res) => {
    try {
      const placeOfDay = await getPlaceOfTheDay();
      // console.log(placeOfDay)
      //console.log("Came to display place")
      return res.json(placeOfDay);
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch place of the day.' })
    }
  });

export default router;