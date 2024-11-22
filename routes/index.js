import { static as staticDir } from 'express';
import aboutRoutes from './about.js';
import coffeeShopRoutes from './coffeeShop.js';
import eventRoutes from './events.js';
import feedRoutes from './feed.js';
import homeRoutes from './home.js';
import locationRoutes from './location.js';
import loginRoutes from './login.js';
import reviewRoutes from './review.js';

const constructorMethod = (app) => {

  app.use("/", loginRoutes);
  app.use("/home", homeRoutes);
  app.use('/feed', feedRoutes);
  app.use('/events', eventRoutes);
  app.use('/about', aboutRoutes);
  app.use('/login', loginRoutes);
  app.use('/review', reviewRoutes);
  app.use('/location', locationRoutes);
  app.use('/coffeeShop', coffeeShopRoutes);
  
  app.use('/public', staticDir('public'));

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Resource not found'});
  });
};

export default constructorMethod;