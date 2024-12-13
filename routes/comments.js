import { Router } from "express";
import xss from "xss";
import { createComment, findCommentById } from "../data/comment.js";
import { validateCommenter, validateObjectIdArray, validateObjectIdString, validateParent, validateString } from "../helpers.js";
const router = Router();


router.route("/")
  .post(async (req, res) => {
    let commenter = req.body.commenter;
    let parent = req.body.parent;
    let body = req.body.body;
    let comments = req.body.comment;

    try {
      commenter = validateCommenter(commenter, 'Commenter');
      parent = validateParent(parent, 'Comment Parent');
      body = validateString(body, 'Comment Body');
      comments = validateObjectIdArray(comments, 'Comments Array');

    } catch (e) {
      return res.status(400).send(e);
    }

    commenter.id = xss(commenter.id);
    commenter.username = xss(commenter.username);
    parent.id = xss(parent.id);
    parent.type = xss(parent.type);
    body = xss(body);
    comments = comments.map((comment) => xss(comment));

    try {
      const newComment = await createComment(commenter, parent, body, comments);
      return newComment;
    } catch (e) {
      return res.status(500).send(e);
    }
  });

router.route("/:id")
  .get(async (req, res) => {
    let id = req.params.id;

    try {
      id = validateObjectIdString(id, 'Comment Id');
    } catch (e) {
      return res.status(400).send(e);
    }

    try {
      const getComment = await findCommentById(id);
      return getComment;
    } catch (e) {
      return res.status(500).send(e);
    }
  });


