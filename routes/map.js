import { Router } from "express";
import * as sessionTokens from "../data/sessionTokens.js";

const router = Router()

router.route('/').get(async (req, res) => {
  try {
    let token;
    try {
      token = req.cookies["session_token"];//gets the sessionId
    } catch {
      throw 'no cookie';
    }
    token = await sessionTokens.sessionChecker(token);//checks if sessionId is valid
    if (token) {
      res.render('../views/map', { title: "WiFly NYC - map" });
    }
  } catch (e) {
    res.status(401).render('../views/invalidLogin', { error: e });
  }
});
/* use req.cookies["session_token"] to get the current sessionId, then you can use that to search the sessionToken collection to find information like the _id of a user
as well as the expiration date/time of the session.
*/

export default router;