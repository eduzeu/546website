import { Router } from "express";
import { createReview, getReviews } from "../data/reviews.js";
import * as helpers from "../helpers.js";

const router = Router()

router.route('/')
    .post(async (req, res) => {
        let score = req.body.rating;
        let text = req.body.text;
        let id = req.body.id;

        try {
            score = helpers.validateRating(score, "Review Rating");
            text = helpers.validateString(text, "Review Text");
            id = helpers.validateNumber(id, "Location ID");

        } catch (e) {
            return res.status(400).json({ error: e });
        }

        try {
            const wifiReview = await createReview(score, text, id);
            return res.json(wifiReview);

        } catch (e) {
            return res.status(500).json({ error: e });
        }
    });

router.route('/')
    .get(async (req, res) => {
        try {
            const reviews = await getReviews();
            res.json(reviews);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });

export default router;