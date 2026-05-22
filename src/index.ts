import express from 'express';
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

app.listen(env.PORT, () => {
  logger.info(`[SERVER] Listening on port ${env.PORT}`);
});
