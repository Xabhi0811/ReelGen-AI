import * as Sentry from "@sentry/node";
import { getAuth } from '@clerk/express';
export const proptect = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Store userId in request for use in controllers
        req.userId = userId;
        next();
    }
    catch (error) {
        console.error('✗ AUTH EXCEPTION:', error);
        Sentry.captureException(error);
        res.status(401).json({ message: error.message || 'Unauthorized' });
    }
};
