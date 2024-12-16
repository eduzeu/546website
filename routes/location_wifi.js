import { Router } from "express";
import { getWiFiLocationNames, getWifiLocations } from "../data/locations.js";
import * as sessionTokens from "../data/sessionTokens.js";


const router = Router()

router.route('/')
  .get(async (req, res) => {
    //used to verify user is logged in
    try {
      let token;
      try {
        token = req.cookies["session_token"];//gets the sessionId
      } catch {
        throw 'no cookie';
      }
      token = await sessionTokens.sessionChecker(token);//checks if sessionId is valid
    } catch (e) {
      res.status(401).render('../views/invalidLogin', { error: e });
    }
    try {
      const wifiLocations = await getWifiLocations();
      res.json(wifiLocations);
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch Wi-Fi locations' });
    }
  });

router.route("/names")
  .get(async (req, res) => {
    try {
      let token;
      try {
        token = req.cookies["session_token"];//gets the sessionId
      } catch {
        throw 'no cookie';
      }
      token = await sessionTokens.sessionChecker(token);//checks if sessionId is valid
    } catch (e) {
      res.status(401).json({ error: e });
    }

    try {
      const names = await getWiFiLocationNames();
      res.json(names);
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch Wi-Fi locations' });
    }
  });

export default router;