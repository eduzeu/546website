import { Router } from "express";
import * as sessionTokens from "../data/sessionTokens.js";
import { getPlaceOfTheDay } from "../data/locations.js";

const router = Router();

router.route('/').get(async (req, res) => {
  try {
    let token;
    try {
      token = req.cookies["session_token"]; 
    } catch {
      throw 'no cookie';
    }
    
    token = await sessionTokens.sessionChecker(token);  
    
    if (token) {
      const placeOfDay = await getPlaceOfTheDay();  
      // console.log("Came to display place", placeOfDay);

       res.render('../views/map', { 
        title: "WiFly NYC - map", 
        placeOfDay
      });
    }
  } catch (e) {
    res.status(401).render('../views/invalidLogin', { error: e });
  }
});

export default router;
