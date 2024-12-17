import { Router } from "express";
import xss from "xss";
import { createComment, findCommentsByParentId } from "../data/comment.js";
import * as sessionTokenFunctions from '../data/sessionTokens.js';
import { validateCommenter, validateObjectIdString, validateParent, validateString } from "../helpers.js";

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

      let commenter = { id: user._id.toString(), name: user.username };
      let parent = { id: req.body.parent, type: "post" };
      let body = req.body.body;

      try {
        commenter = validateCommenter(commenter, "Commenter");
        parent = validateParent(parent, "Comment Parent");
        body = validateString(body, "Comment Body");
      } catch (e) {
        return res.status(400).json({ error: e });
      }

      commenter.id = xss(commenter.id);
      commenter.name = xss(commenter.name);
      parent.id = xss(parent.id);
      body = xss(body);

      // console.log("commenter:");
      // console.log(commenter);
      // console.log("parent:");
      // console.log(parent);
      // console.log("body:");
      // console.log(body);

      //console.log(commenter);

      const newComment = await createComment(commenter, parent, body, []);
      return res.status(201).json(newComment);
    } catch (e) {
      console.error("Error processing POST /comments/:", e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.route("/:id")
  .get(async (req, res) => {
    //console.log(`GET request received for comment ID: ${req.params.id}`);
    let id = req.params.id;

    try {
      id = validateObjectIdString(id, "Comment Id");
    } catch (e) {
      return res.status(404).json({ error: e });
    }

    id = xss(id);

    try {
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
