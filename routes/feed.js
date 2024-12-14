import { Router } from "express";
import * as sessionTokens from "../data/sessionTokens.js";

const router = Router()

router.route("/")
  .get((req, res) => {
    //used to verify user is logged in
    try {
      let token;
      try {
        token = req.cookies["session_token"];//gets the sessionId
      } catch {
        throw 'no cookie';
      }
      token = sessionTokens.sessionChecker(token);//checks if sessionId is valid
    } catch (e) {
      res.status(401).render('../views/invalidLogin', { error: e });
    }
    res.status(200).json({ "implement": "this" });
  })

export default router;