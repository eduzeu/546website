import { Router } from "express";
import xss from "xss";
import * as userFunctions from "../data/users.js";
import { validateEmailAddress, validateString } from "../helpers.js";

const router = Router();

router.route("/")
  .get(async (req, res) => {
    res.render("../views/account", { title: "Welcome to WiFly NYC" });
  })
  .post(async (req, res) => {
    let username = req.body.loginUser;
    let password = req.body.loginPassword;

    try {
      username = validateString(username, "Username").toLowerCase();
      password = validateString(password, "Password");
    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }

    username = xss(username);
    password = xss(password);

    try {
      const result = await userFunctions.checkUser(username, password);

      if (result) {
        return res.redirect("/home");

      } else {
        throw "Invalid Login";
      }

    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  });

router.route("/newAccount")
  .get(async (req, res) => {
    res.render("../views/newAccount", { title: "Welcome to WiFly NYC" });
  })
  .post(async (req, res) => {
    let username = req.body.loginUser;
    let email = req.body.loginEmail;
    let password = req.body.loginPassword;

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

      if (result) {
        res.redirect("/");

      } else {
        throw "Failed to create account";
      }

    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  });

export default router;