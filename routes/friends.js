import { Router } from "express";
import { getAllFriends } from '../data/friendlist.js';

const router = Router()

router.route("/").get(async (req, res) => {
    try {
        console.log(req.session.user.username)
        let allfriends = await getAllFriends(req.session.user.username);;
        res.render('friends', { 'title': 'Friends', 'friends': allfriends ,'username': req.session.user.username });
    } catch (e) {
        return res.status(400).send(e);
    }

    })
export default router;