import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import storyRoutes from './story.routes.js';
import chapterRoutes from './chapter.routes.js';
import genreRoutes from './genre.routes.js';
import favoritesRoutes from './favorites.routes.js';
import ratingsRoutes from './ratings.routes.js';
import readingHistoryRoutes from './readingHistory.routes.js';

console.log(">>> AppRouter loaded");

export default function AppRouter(app) {
  app.use('/api/users', userRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/stories', storyRoutes);
  app.use('/api/chapters', chapterRoutes);
  app.use('/api/genres', genreRoutes);
  app.use('/api/favorites', favoritesRoutes);
  app.use('/api/ratings', ratingsRoutes);
  app.use('/api/history', readingHistoryRoutes);
}
