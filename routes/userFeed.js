import { Router } from "express";
import * as sessionTokenFunctions from "../data/sessionTokens.js";
import session from "express-session";
import { updateFriends } from '../data/friendlist.js';


const router = Router();

router.route("/")
  .get(async (req, res) => {
    try {
      let user = await sessionTokenFunctions.findUserFromSessionToken(req.cookies["session_token"]);
      res.render("userFeed", {
        title: "User Feed",
        cloudName: JSON.stringify(process.env.CLOUDINARY_CLOUD_NAME),
        uploadPreset: JSON.stringify(process.env.CLOUDINARY_UPLOAD_PRESET),
        userData: JSON.stringify(user)
      });
    } catch (e) {
      return res.status(400).send(e);
    }
  })


export default router;