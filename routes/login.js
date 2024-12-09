import { Router } from "express";
import * as userFunctions from "../data/users.js";
import { validateString } from "../helpers.js";
import * as sessionTokenFunctions from "../data/sessionTokens.js";
import cookieParser from "cookie-parser";
import * as uuid from "uuid";

const router = Router();

router.route('/').get(async (req, res) => {
    try{
        let token;
        try{
          token = req.cookies["session_token"];//gets the sessionId
        } catch{
          throw 'no cookie';
        }
        token = await sessionTokenFunctions.sessionChecker(token);//checks if sessionId is valid
        res.redirect('/home/');
    } catch(e){
        console.log(e);
        res.render('../views/account');
    }
})

router.route('/').post(async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userFunctions.checkUser(username, password);
        const sessionId = uuid.v4();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);
        const token = await sessionTokenFunctions.addSessionToken(sessionId, user, expiresAt);
        res.cookie("session_token", sessionId, {maxAge: 30*60*1000, httpOnly: true});
        res.status(200).json(true);
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
    res.render("../views/newAccount", { title: "Welcome to WiFly NYC" });
  })
  .post(async (req, res) => {
    let { username, email, password } = req.body;
    try {
      username = validateString(username, "Username").toLowerCase();
      email = validateEmailAddress(email, "Email");
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