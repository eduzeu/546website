import { Router } from "express";
import * as uuid from 'uuid';
import xss from "xss";
import * as sessionTokenFunctions from "../data/sessionTokens.js";
import * as userFunctions from "../data/users.js";
import { validateEmailAddress, validateString } from "../helpers.js";

const router = Router();

// GET / route to check session token
router.route('/').get(async (req, res) => {
  try {
    let token = req.cookies["session_token"]; // Attempt to retrieve the cookie
    token = await sessionTokenFunctions.sessionChecker(token); // Check if sessionId is valid
    return res.redirect('/home/'); // Render the account page
  } catch (e) {
    console.log(e);
    return res.render('../views/account'); // Render the account page on error
  }
});

// POST / route for login
router.route('/').post(async (req, res) => {
  let username = req.body.loginUser;
  let password = req.body.loginPassword;

  try {
    console.log(username);
    username = validateString(username, "Username").toLowerCase();
    password = validateString(password, "Password");
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }

  username = xss(username);
  password = xss(password);

  try {
    const user = await userFunctions.checkUser(username, password);//isvalid login
    const sessionId = uuid.v4();//unique sessionid
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);//expires in 30 min from creation time
    await sessionTokenFunctions.addSessionToken(sessionId, user, expiresAt);
    res.cookie("session_token", sessionId, { maxAge: 30 * 60 * 1000, httpOnly: true });
    return res.redirect('/home'); // Redirect on successful login

  } catch (error) {
    return res.status(400).json({ error: error.toString() }); // Handle login error
  }
});

// GET and POST /newAccount for account creation
router.route("/newAccount")
  .get(async (req, res) => {
    res.render("../views/newAccount", { title: "Welcome to WiFly NYC" });
  })
  .post(async (req, res) => {
    let username = req.body.loginUser;
    let email = req.body.loginEmail;
    let password = req.body.loginPassword;

    try {
      // Validate inputs
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
      console.log("user inserted sucesfully.")
      res.redirect('/');
    } catch (error) {
      const errorMessage = error && error.message ? error.message : "Unknown error";
      return res.status(errorMessage.includes("validation") ? 400 : 500).json({ error: errorMessage });
    }
  });

router.route("/logout")
  .get(async (req, res) => {
    try {
      const token = req.cookies["session_token"];
      let isDeleted = false;
      if (token) {
        isDeleted = await sessionTokenFunctions.deleteSessionToken(token);
      }
      res.clearCookie("session_token", { httpOnly: true });
      if (isDeleted) {
        return res.redirect("/");
      }
      else {
        throw 'Failed to delete session';
      }
    } catch (error) {
      return res.status(500).send("An error occurred during logout.");
    }
  })

export default router;
