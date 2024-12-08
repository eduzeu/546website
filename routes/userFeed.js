import { Router } from "express";
import { insertUserReview } from "../data/reviews";

const router = Router();

router.route("/")
  .get(async (req, res) => {
    try{
      res.render("userFeed");
    }catch (e){
      return res.status(400).send(e);
    }
  });

router.route("/:review")
  .post(async (req, res) => { 
    try{
      let review = req.body.reviw; 
      let rating = req.body.rating;
      let place = req.body.place; 
      //find way to get id
      let userId;

      const postReview = await insertUserReview(userId, review, rating, place)
    }catch(e){
      console.error(e);
    }
  });

export default router;