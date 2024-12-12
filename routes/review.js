import { Router } from "express";
import xss from "xss";
import { createReview, getReviewById, getReviews, getReviewFromUser } from "../data/reviews.js";
import * as helpers from "../helpers.js";
import * as sessionTokens from "../data/sessionTokens.js";
import { validateNumber, validateRating, validateReviewType, validateString, validateNumericId} from "../helpers.js";
import { findUserFromSessionToken} from "../data/sessionTokens.js";

const router = Router()

router.route('/')
    .post(async (req, res) => {
        //used to verify user is logged in
        try{
            let token;
            try{
              token = req.cookies["session_token"];//gets the sessionId
            } catch{
              throw 'no cookie';
            }
            token = await sessionTokens.sessionChecker(token);//checks if sessionId is valid
          } catch(e){
            res.status(401).render('../views/invalidLogin', { error: e });
          }
        let score = req.body.rating;
        let text = req.body.text;
        let id = req.body.id;
        let reviewType = req.body.type;

        try {
            score = validateRating(score, "Review Rating");
            text = validateString(text, "Review Text");
            id = validateNumber(id, "Location ID");
            reviewType = validateReviewType(reviewType, "Review Type")

        } catch (e) {
            return res.status(400).json({ error: e });
        }

        text = xss(text);
        reviewType = xss(reviewType);

        try {
            const review = await createReview(score, text, id, reviewType);
            return res.json(review);

        } catch (e) {
            return res.status(500).json({ error: e });
        }
    });

router.route('/')
    .get(async (req, res) => {
        //used to verify user is logged in
        // try{
        //     let token;
        //     try{
        //       token = req.cookies["session_token"];//gets the sessionId
        //     } catch{
        //       throw 'no cookie';
        //     }
        //     token = await sessionTokens.sessionChecker(token);//checks if sessionId is valid
        //   } catch(e){
        //     res.status(401).render('../views/invalidLogin', { error: e });
        //   }
        try {
            const reviews = await getReviews();
            res.json(reviews);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });

router.route("/place/:placeId")
    .get( async (req, res) => {
        let placeId = req.params.placeId;
        let sessionId = req.cookies["session_token"];
        let userId = await findUserFromSessionToken(sessionId);
        try{
            console.log("I came here!!!!");
            console.log(userId._id,placeId)
            const isReview = await getReviewFromUser(placeId, userId._id);
            console.log(isReview);
            return isReview;
        }catch(e){
            console.error(e);
        }
});

router.route('/:type')
    .get(async (req, res) => {
        //used to verify user is logged in
        // try{
        //     let token;
        //     try{
        //       token = req.cookies["session_token"];//gets the sessionId
        //     } catch{
        //       throw 'no cookie';
        //     }
        //     token = await sessionTokens.sessionChecker(token);//checks if sessionId is valid
        //   } catch(e){
        //     res.status(401).render('../views/invalidLogin', { error: e });
        //   }
        let reviewType = req.params.type;

        try {
            reviewType = validateReviewType(reviewType, "Review Type")
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
        //used to verify user is logged in
        // try{
        //     let token;
        //     try{
        //       token = req.cookies["session_token"];//gets the sessionId
        //     } catch{
        //       throw 'no cookie';
        //     }
        //     token = await sessionTokens.sessionChecker(token);//checks if sessionId is valid
        //   } catch(e){
        //     res.status(401).render('../views/invalidLogin', { error: e });
        //   }
        let reviewType = req.params.type;
        let id = req.params.id;
        console.log(reviewType, id);
        try {
            reviewType = validateReviewType(reviewType, "Review Type");
            id = validateNumericId(id, "Location ID");
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