import { Router } from "express";
import * as sessionTokens from "../data/sessionTokens.js";

const router = Router()

router.route('/').get(async (req, res) => {
  try {
    let token = req.cookies["session_token"];
    token = await sessionTokens.sessionChecker(token);
    if (token) {
      res.render('../views/home', { title: "WiFly NYC" });
    }
  } catch (e) {
    res.status(401).render('../views/invalidLogin', { error: e });
  }
});

export default router;