import { Router } from "express";
import xss from "xss";
import { findPostById, getLocationImages, getUserFeedPost, insertUserPost } from "../data/posts.js";
import { findUserFromSessionToken } from "../data/sessionTokens.js";
import { validateImageDetails, validateLocationPostDetails, validateObjectIdString, validateString } from "../helpers.js";

const router = Router();

router.route("/")
    .get(async (req, res) => {
        try {
            //console.log("GET ALL REVIEWS, came from DOM!");
            const getReviews = await getUserFeedPost();
            //console.log(getReviews);
            return res.json(getReviews);
        } catch (e) {
            return res.status(400).send(e);
        }
    })
    .post(async (req, res) => {
        let review = req.body.reviewText;
        let title = req.body.title;
        let image = req.body.image;
        let location = req.body.location;
        location.id = `${location.id}`;

        try {
            review = validateString(review, "Review Text");
            title = validateString(title, "Review Title");
            image = validateImageDetails(image, "Image Details");
            location = validateLocationPostDetails(location, "Location Details");
            location.id = `${location.id}`;

        } catch (e) {
            return res.status(400).json({ error: e });
        }

        // XSS
        review = xss(review);
        title = xss(title);

        if (image) {
            image.url = xss(image.url);
            image.altText = xss(image.altText);
        }

        if (location) {
            location.id = xss(location.id);
            location.type = xss(location.type);
            location.name = xss(location.name);
            if (location.detail) { location.detail = xss(location.detail) }
        }

        try {
            let sessionId = req.cookies["session_token"];
            let user = await findUserFromSessionToken(sessionId);
            const postReview = await insertUserPost(user, review, title, image, location);
            return res.status(200).json(postReview);
        } catch (e) {
            console.error(e);
            return res.status(500).send(e);
        }
    });

router.route("/:id")
    .get(async (req, res) => {
        let user;
        try {
            req.params.id = validateObjectIdString(req.params.id, "Post Id");
            req.params.id = xss(req.params.id);
        } catch (e) {
            //console.log(e);
            return res.status(400).send(e);
        }
        try{
            user = await findUserFromSessionToken(req.cookies["session_token"]);
        }
        catch (e) {
            //console.log(e);
            return res.status(400).json({ error:e });
        }
        try {
            const post = await findPostById(req.params.id);
            return res.render('post', {
                title: post.placeName,
                post: post,
                userData: JSON.stringify(user)
            });
        } catch (e) {
            //console.log(e);
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

    req.body.id = xss(req.body.id);
    req.body.type = xss(req.body.type);

    try {
        const images = await getLocationImages(id);
        return res.json(images);
        
    } catch (e) {
        //console.log(e);
        return res.status(500).json({ error: e });
    }
})

export default router;