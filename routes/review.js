import { Router } from "express";
import { createReview, getReviewById, getReviews } from "../data/reviews.js";
import * as helpers from "../helpers.js";

const router = Router()

router.route('/')
    .post(async (req, res) => {
        let score = req.body.rating;
        let text = req.body.text;
        let id = req.body.id;
        let reviewType = req.body.type;

        try {
            score = helpers.validateRating(score, "Review Rating");
            text = helpers.validateString(text, "Review Text");
            id = helpers.validateNumber(id, "Location ID");
            reviewType = helpers.validateReviewType(reviewType, "Review Type")

        } catch (e) {
            return res.status(400).json({ error: e });
        }

        try {
            const wifiReview = await createReview(score, text, id, reviewType);
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


router.route('/:type')
    .get(async (req, res) => {
        let reviewType = req.params.type;

        try {
            reviewType = helpers.validateReviewType(reviewType, "Review Type")
        } catch (e) {
            return res.status(400).json({ error: e });
        }

        try {
            const reviews = await getReviews(reviewType);
            res.json(reviews);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });

router.route("/:type/:id")
    .get(async (req, res) => {
        let reviewType = req.params.type;
        let id = req.params.id;

        try {
            reviewType = helpers.validateReviewType(reviewType, "Review Type");
            id = helpers.validateNumericId(id, "Location ID");
        } catch (e) {
            return res.status(400).json({ error: e });
        }

        try {
            const reviews = await getReviewById(id, reviewType);
            res.json(reviews);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });

export default router;