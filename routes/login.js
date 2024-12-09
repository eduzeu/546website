import { Router } from "express";
import xss from "xss";
import * as userFunctions from "../data/users.js";
import { validateString } from "../helpers.js";

const router = Router();

router.route("/")
  .get(async (req, res) => {
    res.render("../views/account", { title: "Welcome to WiFly NYC" });
  })
  .post(async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
      username = validateString(username, "Username").toLowerCase();
      password = validateString(password, "Password");
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }

    username = xss(username);
    password = xss(password);

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
    res.render("../views/newAccount", { title: "Welcome to WiFly NYC" });
  })
  .post(async (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    try {
      username = validateString(username, "Username").toLowerCase();
      email = validateEmailAddress(email, "Email");
      password = validateString(password, "Password");
    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }

    username = xss(username);
    email = xss(email);
    password = xss(password);

    try {
      const result = await userFunctions.addNewUser(username, email, password);
      res.status(200).json(result);

    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  });

export default router;