import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import express, { Application, Request, Response } from 'express';
import { swaggerSpec } from './config/swagger';
import { logger } from './middleware/logger.middleware';
import eventRoutes from './routes/events';
import guestRoutes from './routes/guests';

export const app: Application = express();

// only my Angular app is allowed to call the API from a browser
app.use(cors({ origin: 'http://localhost:4200' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.use(logger);

app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/guests', guestRoutes);

app.get('/ping', async (_req: Request, res: Response) => {
  res.json({
    message: 'Event Planner API is running'
  });
});
