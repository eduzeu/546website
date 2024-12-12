import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import express from 'express';
import exphbs from 'express-handlebars';
import * as sessionTokenFunctions from './data/sessionTokens.js';
import configRoutes from './routes/index.js';

const app = express();

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', async (req, res, next) => {
  const timestamp = new Date().toUTCString();
  const method = req.method;
  const route = req.originalUrl;
  let authorizedUser = false;
  let sessionId;
  try {
    sessionId = req.cookies["session_token"];
    let checked = await sessionTokenFunctions.sessionChecker(sessionId);
    if (checked == null) {
      throw 'Failed check';
    }
    authorizedUser = true;
  } catch (e) {
    authorizedUser = false;
  }
  if (route == '/' || route == '/newAccount') {
    if (authorizedUser) {
      return res.redirect('/home/');
    }
  }
  // else if(route.startsWith('/location')){
  //   return res.redirect('/home/');//if a user tries to get to the /location routes send them to error page. MAKE ROUTE FOR /ERROR that links back to home if authorized
  //   //and '/' if unauthorized
  // }
  // else if(route.startsWith('/review')){
  //   return res.redirect('/home');//same as above
  // }
  else {
    if (!authorizedUser) {
      return res.redirect('/');
    }
  }
  next();
});
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
