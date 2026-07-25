import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { PrismaClient } from '@prisma/client';
import { swaggerSpec } from './swagger';
import authRoutes from './routes/auth.routes';
import siteDetailRoutes from './routes/siteDetail.routes';
import siteRoutes from './routes/site.routes';
import webhookRoutes from './routes/webhook.routes';
import billingRoutes from './routes/billing.routes';
import socialOfferRoutes from './routes/socialOffer.routes';
import adminRoutes from './routes/admin.routes';

// Start background workers (Temporarily disabled because Docker is broken on local machine)
// import './workers/publish.worker';
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
export const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Portfolio AI API is running' });
});

// Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes will be added here
app.use('/api/auth', authRoutes);
app.use('/api/site-details', siteDetailRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/social-offers', socialOfferRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL database via Prisma');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server or connect to DB:', error);
    process.exit(1);
  }
};

startServer();
