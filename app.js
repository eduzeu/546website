import { v2 as cloudinary } from "cloudinary";
import express from 'express';
import exphbs from 'express-handlebars';
import configRoutes from './routes/index.js';

const app = express();

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

cloudinary.config({
  cloud_name: 'dcvqjizwy',
  api_key: '529917188571682',
  api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
