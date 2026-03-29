import {Request, Response, NextFunction} from 'express';
import * as Sentry from "@sentry/node"
import { getAuth } from '@clerk/express';


declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const  proptect = async(req: Request, res: Response, next:NextFunction)=>{
try {
     const { userId } = getAuth(req);
     if(!userId){
        return res.status(401).json({message: 'Unauthorized'})
     }
     
     // Store userId in request for use in controllers
     req.userId = userId;
     next()
} catch (error:any) {
    console.error('✗ AUTH EXCEPTION:', error);
    Sentry.captureException(error)
    res.status(401).json({message: error.message || 'Unauthorized'})
    
}
}