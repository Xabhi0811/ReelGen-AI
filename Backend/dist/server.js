import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controller/clerk.js';
import "./configs/instrument.mjs";
import * as Sentry from "@sentry/node";
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
const requiredEnv = ['DATABASE_URL', 'CLERK_SECRET_KEY', 'CLERK_WEBHOOK_SIGNING_SECRET'];
for (const key of requiredEnv) {
    if (!process.env[key] || process.env[key]?.trim() === '') {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);
app.use(clerkMiddleware());
app.use(express.json());
// Request logging middleware
app.use((req, res, next) => {
    console.log(`\n📥 ${req.method} ${req.path}`);
    console.log('   Authorization:', req.headers.authorization ? 'Present' : 'Missing');
    next();
});
app.get('/', (req, res) => {
    res.send('Server is Live!');
});
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});
app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);
// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('Routes registered:');
    console.log('  GET /api/user/publish/:projectId');
    console.log('  GET /api/user/credits');
    console.log('  GET /api/user/projects');
    console.log('  GET /api/user/projects/:projectId');
});
