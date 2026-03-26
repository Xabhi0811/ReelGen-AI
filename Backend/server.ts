import express, {Request, Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controller/clerk.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const requiredEnv = ['DATABASE_URL', 'CLERK_SECRET_KEY', 'CLERK_WEBHOOK_SIGNING_SECRET'] as const;
for (const key of requiredEnv) {
    if (!process.env[key] || process.env[key]?.trim() === '') {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.post('/api/clerk', express.raw({type: 'application/json'}), clerkWebhooks)

app.use(clerkMiddleware())
app.use(express.json())



app.get('/',(req: Request, res: Response)=>{
    res.send('Server is Live!');
});

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
});