import { Router } from "express";
import * as sessionTokens from "../data/sessionTokens.js";
import { validateNumber, validateNumericId, validateRating, validateReviewType, validateString } from "../helpers.js";
import { createComment,findCommentById } from "../data/comment.js";
const router = Router();


router.route("/commentReview")
  .post(async (req, res) =>{
    let commenter = req.body.commenter;
    let parent = req.body.parent;
    let body = req.body.body;
    let comments = req.body.comment;

     try{
      const newComment = await createComment(commenter, parent, body, comments);
      return newComment;
    }catch(e){
      console.error(e);
    }
  });

router.route("/:id")
  .get(async (req, res) => {
    let id = req.params.id;
    try{ 
      const getComment = findCommentById(id);S
      return getComment;
    }catch(e){
      console.error(e);
    }
  });


