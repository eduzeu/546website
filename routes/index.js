import { static as staticDir } from 'express';
import aboutRoutes from './about.js';
import coffeeShopRoutes from './coffeeShop.js';
import eventRoutes from './events.js';
import feedRoutes from './feed.js';
import locationRoutes from './location.js';
import loginRoutes from './login.js';
import reviewRoutes from './review.js';
import mapRoutes from './map.js';

const constructorMethod = (app) => {
  app.use('/feed', feedRoutes);
  app.use('/events', eventRoutes);
  app.use('/about', aboutRoutes);
  app.use('/review', reviewRoutes);
  app.use('/location', locationRoutes);
  app.use('/coffeeShop', coffeeShopRoutes);
  app.use('/home', mapRoutes);
  
  app.use('/public', staticDir('public'));

  app.use("/", loginRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Resource not found'});
  });
};

export default constructorMethod;