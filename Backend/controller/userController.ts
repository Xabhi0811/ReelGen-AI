import {Request, Response} from 'express'
 import * as Sentry from "@sentry/node"

 //get user credits
 export const getUserCredits = async (req: Request, res: Response)=>{
    try{

    } catch(error :any){
        Sentry.captureException(error);
        res.status(500).json({message: error.code || error.message})
    }
 }
 

 //const get all user prject

  export const getAllProjects = async (req: Request, res: Response)=>{
    try{

    } catch(error :any){
        Sentry.captureException(error);
        res.status(500).json({message: error.code || error.message})
    }
 }

 //get project by id 
  export const getProjectsById = async (req: Request, res: Response)=>{
    try{

    } catch(error :any){
        Sentry.captureException(error);
        res.status(500).json({message: error.code || error.message})
    }
 }


 //publish /unpublish project
  export const getUserCredits = async (req: Request, res: Response)=>{
    try{

    } catch(error :any){
        Sentry.captureException(error);
        res.status(500).json({message: error.code || error.message})
    }
 }