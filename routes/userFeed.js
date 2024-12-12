import { Router } from "express";
import xss from "xss";
import { findPostById, getUserFeedPost, insertUserPost } from "../data/posts.js";
import { findUserFromSessionToken } from "../data/sessionTokens.js";
import { validateCloudinaryUrl, validateObjectIdString, validateString } from "../helpers.js";

const router = Router();

router.route("/")
  .get(async (req, res) => {
    try {
      res.render("userFeed", {
        title: "User Feed",
        cloudName: JSON.stringify(process.env.CLOUDINARY_CLOUD_NAME),
        uploadPreset: JSON.stringify(process.env.CLOUDINARY_UPLOAD_PRESET)
      });
    } catch (e) {
      return res.status(400).send(e);
    }
  });


//insertUserReview(placeName, reviewText, rating) //inserts review to database

router.route("/posts")
  .post(async (req, res) => {
    let review = req.body.reviewText;
    let place = req.body.placename;
    let imageUrl = req.body.imageUrl;

    try {
      review = validateString(review, "Review Text");
      place = validateString(place, "Place Name");
      if (imageUrl) { imageUrl = validateCloudinaryUrl(imageUrl, "Image URL") }

    } catch (e) {
      return res.status(400).json({ error: e });
    }

    review = xss(review);
    place = xss(place);
    if (imageUrl) { imageUrl = xss(imageUrl) }

    try {
      let sessionId = req.cookies["session_token"];
      let user = await findUserFromSessionToken(sessionId);
      const postReview = await insertUserPost(user, review, imageUrl, place);
      return postReview;
    } catch (e) {
      console.error(e);
      return res.status(500).send(e);
    }
  });

router.route("/posts/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validateObjectIdString(req.params.id, "Post Id");
    } catch (e) {
      return res.status(400).send(e);
    }

    try {
      const post = await findPostById(req.params.id);
      return res.render('post', { post });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: e });
    }
  })
router.route("/comments/:id")
  .get(async (req, res) => {
    try {
      //get all the comments here
      console.log("hit getComments");
    } catch (e) {
      return res.status(400).send(e);
    }
  })
router.route("/posts")
  .get(async (req, res) => {
    try {
      //console.log("GET ALL REVIEWS, came from DOM!");
      const getReviews = await getUserFeedPost();
      console.log(getReviews);
      return res.json(getReviews);
    } catch (e) {
      return res.status(400).send(e);
    }
  });

export default router;