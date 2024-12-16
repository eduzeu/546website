import { Router } from "express";

const router = Router()

router.route("/")
    .get((req, res) => {
        try {
            res.render('home', { title: 'About us' });
        } catch (e) {
            return res.status(400).send(e);
        }   
    })

export default router;