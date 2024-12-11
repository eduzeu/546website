import { Router } from "express";
import { insertUserPost, getUserFeedPost, findPostById} from "../data/posts.js";
import { findUserFromSessionToken} from "../data/sessionTokens.js";
import { validateNumber, validateRating, validateReviewType, validateString, validateNumericId} from "../helpers.js";

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
 
router.route("/post")
  .post(async (req, res) => { 
    try{
      let review = req.body.reviewText;
      let place = req.body.placename;
      console.log(req.body);
      let imageUrl;
      if(req.body.imageUrl){
        imageUrl = req.body.imageUrl;
      }
      let sessionId = req.cookies["session_token"];
      //find way to get id
      let user = await findUserFromSessionToken(sessionId);
      const postReview = await insertUserPost(user, review, imageUrl, place);
      return postReview;
    }catch(e){
      console.error(e);
      return res.status(400).send(e);
    }
  });
router.route("/post/:id")
  .get(async (req, res) => {
    let postId = req.params.id;
    console.log(postId);
    let post;
    try{
      post = await findPostById(postId);
    }catch(e){
      console.log(e);
      return res.status(400).json({error: e});
    }
    // try{
    //   postId = validateNumericId(postId, "postId");
    // } catch(e){
    //   return res.status(400).json({error: e});
    // }
    return res.render('post', {post});
  })
router.route("/getComments/:id")
  .get(async (req, res) => {
    try{
      //get all the comments here
      console.log("hit getComments");
    } catch(e){
      return res.status(400).send(e);
    }
  })
router.route("/getPosts")
.get(async (req, res) => {
  try{
    //console.log("GET ALL REVIEWS, came from DOM!");
    const getReviews = await getUserFeedPost();
    console.log(getReviews);
    return res.json(getReviews);  
  }catch(e){
    return res.status(400).send(e);
  }
});

export default router;