import { Router } from "express";
//import { getAllFriends } from '../data/friendlist.js';
import * as friendFunctions from "../data/friendlist.js";
import * as sessionTokenFunctions from "../data/sessionTokens.js";
import { validateString } from "../helpers.js";


const router = Router()

router.route("/").get(async (req, res) => {
    try {
        let user = await sessionTokenFunctions.findUserFromSessionToken(req.cookies["session_token"]);
        res.render('friends', { 'title': 'Friends', 'friends': user.friends ,'username': user.username });
    } catch (e) {
        return res.status(400).send(e);
    }
})
router.route("/").post(async (req, res) => {
    let newFriend = req.body.poster;

    try {
        newFriend = validateString(newFriend, "Friend Username");
    } catch (e) {
        return res.status(400).send(e);
    }

    let user;
    try {
        user = await sessionTokenFunctions.findUserFromSessionToken(req.cookies["session_token"]);
    } catch (e) {
        return res.status(400).send(e);
    }

    try {
        let inserted = await friendFunctions.updateFriends(user.username, newFriend);
        if(!inserted.acknowledged){
            throw 'Error updating user object';
        }
    } catch (e) {
        return res.status(500).send(e);
    }
})
export default router;