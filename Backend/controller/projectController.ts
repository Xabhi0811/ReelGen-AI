 import {Request, Response} from 'express'
 import * as Sentry from "@sentry/node"


 export const createProject = async (req:Request, res: Response) =>{
     let tempProjectId: string;
     const {userId} = req.auth();
     let isCreditDeducted = false;

     const {name = 'New Project', aspectRatio, userPrompt, productName,
      productDescription, targetLength =5 } = req.body

    try {
        
    } catch (error:any) {
        Sentry.captureException(error);
       res.status(500).json({message: error.message})
        
    }
 }



 export const createVideo = async (req:Request, res: Response) =>{
    try {
        
    } catch (error:any) {
        Sentry.captureException(error);
       res.status(500).json({message: error.message})
        
    }
 }

 export const getAllPublishedProjects = async (req:Request, res: Response) =>{
    try {
        
    } catch (error:any) {
        Sentry.captureException(error);
       res.status(500).json({message: error.message})
        
    }
 }



 export const deleteProject = async (req:Request, res: Response) =>{
    try {
        
    } catch (error:any) {
        Sentry.captureException(error);
       res.status(500).json({message: error.message})
        
    }
 }

export default {
  createProject,
  createVideo,
  deleteProject,
  getAllPublishedProjects
}