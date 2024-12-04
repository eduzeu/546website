import { Router } from "express";
import * as userFunctions from "../data/users.js";

const router = Router();

router.route("/")
  .get(async (req, res) => {
    res.render("../views/account");
  })
  .post(async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await userFunctions.checkUser(username, password);
      if (result) {
        res.status(200).json(result);
      } else {
        throw "Invalid Login";
      }
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

router.route("/newAccount")
  .get(async (req, res) => {
    res.render("../views/newAccount");
  })
  .post(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const result = await userFunctions.addNewUser(username, email, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

export default router;