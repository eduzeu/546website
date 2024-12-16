import { Router } from "express";
import xss from "xss";
import { createComment, findCommentsByParentId } from "../data/comment.js";
import { findPostById } from "../data/posts.js";
import { validateCommenter, validateParent, validateString, validateObjectIdString } from "../helpers.js";
import * as sessionTokenFunctions from '../data/sessionTokens.js';

const router = Router();

router.route("/")
  .post(async (req, res) => {
    //console.log("POST request received at /comments/");
    try {
      const token = req.cookies["session_token"];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized: No session token provided." });
      }

      const user = await sessionTokenFunctions.findUserFromSessionToken(token);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized: Invalid session token." });
      }

      const commenter = { id: xss(user._id), name: xss(user.username) };
      const parent = { id: xss(req.body.parent), type: "Post" };
      const body = xss(req.body.body);

      // console.log("commenter:");
      // console.log(commenter);
      // console.log("parent:");
      // console.log(parent);
      // console.log("body:");
      // console.log(body);

      // Validate input
      // try {
      //   validateCommenter(commenter, "Commenter");
      //   validateParent(parent, "Comment Parent");
      //   validateString(body, "Comment Body");
      // } catch (validationError) {
      //   return res.status(400).json({ error: validationError.message });
      // }
      //console.log(commenter);

      const newComment = await createComment(commenter, parent, body, []);
      return res.status(201).json(newComment);
    } catch (error) {
      console.error("Error processing POST /comments/:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.route("/:id")
  .get(async (req, res) => {
    //console.log(`GET request received for comment ID: ${req.params.id}`);
    try {
      const id = xss(req.params.id);
      const getComments = await findCommentsByParentId(id);
      if (!getComments) {
        return res.status(404).json({ error: "Comment not found" });
      }

      return res.status(200).json(getComments);
    } catch (error) {
      console.error("Error processing GET /comments/:id:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

export default router;
