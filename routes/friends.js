import { Router } from "express";
//import { getAllFriends } from '../data/friendlist.js';
import * as sessionTokenFunctions from "../data/sessionTokens.js";
import session from "express-session";


const router = Router()

router.route("/").get(async (req, res) => {
    try {
        let user = await sessionTokenFunctions.findUserFromSessionToken(req.cookies["session_token"]);
        res.render('friends', { 'title': 'Friends', 'friends': user.friends ,'username': user.username });
    } catch (e) {
        return res.status(400).send(e);
    }
})
export default router;