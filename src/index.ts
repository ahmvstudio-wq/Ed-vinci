import express from 'express';
import path from 'path';
import { env } from './config/env';
import { logger } from './utils/logger';

import activateRouter from './routes/activate';
import statusRouter from './routes/status';
import cardRouter from './routes/card';
import progressRouter from './routes/progress';
import refineRouter from './routes/refine';
import generateDayRouter from './routes/generateDay';

const app = express();
app.use(express.json());

// API Routes
app.use('/api', activateRouter);
app.use('/api', statusRouter);
app.use('/api', cardRouter);
app.use('/api', progressRouter);
app.use('/api', refineRouter);
app.use('/api', generateDayRouter);

// Serve static files from the React app
const distPath = path.resolve(process.cwd(), 'frontend/dist');
app.use(express.static(distPath));

// Catch-all handler for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'Not Found' });
    return;
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

app.listen(env.PORT, () => {
  logger.info(`[SERVER] Listening on port ${env.PORT}`);
});
