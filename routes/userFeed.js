import { Router } from "express";
import { insertUserReview, getUserFeedReviews} from "../data/reviews.js";

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
      let rating = req.body.reviewText;
      let place = req.body.placename;
      let sessionId = req.cookies["session_token"];

      //find way to get id
      let userId;

      const postReview = await insertUserReview(userId, review, rating, place);
      return postReview;

    }catch(e){
      console.error(e);
      return res.status(400).send(e);
    }
  });


router.route("/:id")
.get(async (req, res) => {
  try{
    let userId = req.body.userId;

    const getReviews = await getUserFeedReviews(userId);
    return getReviews;
  }catch(e){
    return res.status(400).send(e);
  }
});

export default router;