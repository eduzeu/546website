import { static as staticDir } from 'express';
import aboutRoutes from './about.js';
import eventRoutes from './events.js';
import feedRoutes from './feed.js';
import locateRoutes from './locate.js';
import loginRoutes from './login.js';

const constructorMethod = (app) => {
  app.use('/feed', feedRoutes);
  app.use('/events', eventRoutes);
  app.use('/about', aboutRoutes);
  app.use('/login', loginRoutes);
  app.use('/locate', locateRoutes);
  
  app.use('/public', staticDir('public'));
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Resource not found'});
  });
};

export default constructorMethod;