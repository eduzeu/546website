import { Router } from "express";
import xss from "xss";
import { findPostById, getLocationImages, getUserFeedPost, insertUserPost } from "../data/posts.js";
import { findUserFromSessionToken } from "../data/sessionTokens.js";
import { validateCloudinaryUrl, validateObjectIdString, validateString } from "../helpers.js";

const router = Router();

router.route("/")
    .get(async (req, res) => {
        try {
            //console.log("GET ALL REVIEWS, came from DOM!");
            const getReviews = await getUserFeedPost();
            console.log(getReviews);
            return res.json(getReviews);
        } catch (e) {
            return res.status(400).send(e);
        }
    })
    .post(async (req, res) => {
        let review = req.body.reviewText;
        let place = req.body.placename;
        let imageUrl = req.body.imageUrl;
        let imageAltText = req.body.imageAltText;

        try {
            review = validateString(review, "Review Text");
            place = validateString(place, "Place Name");
            if (imageUrl && imageAltText) {
                imageUrl = validateCloudinaryUrl(imageUrl, "Image URL");
                imageAltText = validateString(imageAltText, "Image Alt Text");

            } else if ((imageUrl && !imageAltText) || (!imageUrl && imageAltText)) {
                throw "Both image URL and image alt text must be provided";
            }

        } catch (e) {
            return res.status(400).json({ error: e });
        }

        review = xss(review);
        place = xss(place);
        if (imageUrl) { imageUrl = xss(imageUrl) }
        if (imageAltText) { imageAltText = xss(imageAltText) }

        try {
            let sessionId = req.cookies["session_token"];
            let user = await findUserFromSessionToken(sessionId);
            const postReview = await insertUserPost(user, review, imageUrl, imageAltText, place);
            return res.status(200).json(postReview);
        } catch (e) {
            console.error(e);
            return res.status(500).send(e);
        }
    });

router.route("/:id")
    .get(async (req, res) => {
        try {
            req.params.id = validateObjectIdString(req.params.id, "Post Id");
        } catch (e) {
            return res.status(400).send(e);
        }

        try {
            const post = await findPostById(req.params.id);
            return res.render('post', {
                title: post.placeName,
                post: post
            });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: e });
        }
    })

router.route("/images")
.get(async (req, res) => {
    try {
        req.body.id = validateObjectIdString(req.params.id, "Location Id");
        req.body.type = validateString(req.body.type, "Location Type");
        if (req.body.type.toLowercase() != "coffee") { throw "Location Type must be coffee" };
    } catch (e) {
        return res.status(400).send(e);
    }

    try {
        const images = await getLocationImages(id);
        return res.json(images);
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e });
    }
})

export default router;