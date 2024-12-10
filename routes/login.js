import { Router } from "express";
import * as userFunctions from "../data/users.js";
import * as sessionTokenFunctions from "../data/sessionTokens.js";
import cookieParser from "cookie-parser";
import * as uuid from "uuid";
import { validateString, validateEmailAddress, validateNumber } from "../helpers.js";

const router = Router();

// GET / route to check session token
router.route('/').get(async (req, res) => {
    try {
        // let token = req.cookies["session_token"]; // Attempt to retrieve the cookie
        // token = await sessionTokenFunctions.sessionChecker(token); // Check if sessionId is valid
        return res.render('../views/account'); // Render the account page
    } catch (e) {
        console.log(e);
        return res.render('../views/account'); // Render the account page on error
    }
});

// POST / route for login
router.route('/').post(async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userFunctions.checkUser(username, password);
        const sessionId = uuid.v4();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);
        await sessionTokenFunctions.addSessionToken(sessionId, user, expiresAt);
        res.cookie("session_token", sessionId, { maxAge: 30 * 60 * 1000, httpOnly: true });
        return res.status(200).json(true); // Send response on successful login
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
    let { username, email, password } = req.body;
    try {
      // Validate inputs
      username = validateString(username, "Username").toLowerCase();
      email = validateEmailAddress(email, "Email");
      password = validateString(password, "Password");

      // Create new user
      const result = await userFunctions.addNewUser(username, email, password);
      console.log("user inserted sucesfully.")
      return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      const errorMessage = error && error.message ? error.message : "Unknown error";
      return res.status(errorMessage.includes("validation") ? 400 : 500).json({ error: errorMessage });    }
  });

export default router;
