import { Router } from "express";
import { insertUserReview, getUserFeedReviews} from "../data/reviews.js";
import { findUserFromSessionToken} from "../data/sessionTokens.js";

const router = Router();

router.route("/")
  .get(async (req, res) => {
    try{
      res.render("userFeed");
    }catch (e){
      return res.status(400).send(e);
    }
  });

  
 //insertUserReview(placeName, reviewText, rating) //inserts review to database
 
router.route("/review")
  .post(async (req, res) => { 
    try{
      let review = req.body.reviewText;
      let place = req.body.placename;
      let sessionId = req.cookies["session_token"];
      console.log("calling insert user rev route");
      console.log("data from review: ", review, place, sessionId);
      //find way to get id
      let userId= await findUserFromSessionToken(sessionId);
      console.log("user id", userId._id);
      const postReview = await insertUserReview(userId._id, review, place);
      return postReview;

    }catch(e){
      console.error(e);
      return res.status(400).send(e);
    }
  });


router.route("/getReviews")
.get(async (req, res) => {
  try{
    console.log("GET ALL REVIEWS, came from DOM!");
    const getReviews = await getUserFeedReviews();
    return res.json(getReviews);  
  }catch(e){
    return res.status(400).send(e);
  }
});

export default router;