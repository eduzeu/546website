import { Router } from "express";
import * as userFunctions from "../data/users.js";
import { validateString } from "../helpers.js";

const router = Router();

router.route("/")
  .get(async (req, res) => {
    res.render("../views/account");
  })
  .post(async (req, res) => {
    let { username, password } = req.body;

    try {
      username = validateString(username, "Username").toLowerCase();
      password = validateString(password, "Password");
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }

    try {
      const result = await userFunctions.checkUser(username, password);

      if (result) {
        res.status(200).json(result);

      } else {
        throw "Invalid Login";
      }

    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  });

router.route("/newAccount")
  .get(async (req, res) => {
    res.render("../views/newAccount");
  })
  .post(async (req, res) => {
    let { username, email, password } = req.body;
    try {
      username = validateString(username, "Username").toLowerCase();
      email = validateString(email, "Email");
      password = validateString(password, "Password");

    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }

    try {
      const result = await userFunctions.addNewUser(username, email, password);
      res.status(200).json(result);

    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  });

export default router;