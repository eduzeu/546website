import { static as staticDir } from 'express';
import aboutRoutes from './about.js';
import commentsRoutes from "./comments.js";
import friendRoutes from './friends.js';
import locationRoutes from './location.js';
import loginRoutes from './login.js';
import mapRoutes from './map.js';
import postRoutes from "./posts.js";
import reviewRoutes from './review.js';
import userFeedRoutes from "./userFeed.js";
import commentRoutes from './comments.js';

const constructorMethod = (app) => {
  app.use('/about', aboutRoutes);
  app.use('/review', reviewRoutes);
  app.use('/location', locationRoutes);
  app.use('/comments', commentsRoutes);
  app.use('/posts', postRoutes);
  app.use('/friends', friendRoutes);
  app.use('/home', mapRoutes);
  app.use("/userFeed", userFeedRoutes)
  app.use("/comments", commentRoutes);
  app.use('/public', staticDir('public'));

  app.use("/", loginRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Resource not found' });
  });
};

export default constructorMethod;