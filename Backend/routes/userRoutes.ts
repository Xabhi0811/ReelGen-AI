 import express from 'express'
import { proptect } from '../middlewares/auth.js';
import { getAllProjects, getProjectsById, getUserCredits, toggleProjectPublic } from '../controller/userController.js';
 


 const userRouter = express.Router();

 userRouter.get('/credits', proptect, getUserCredits)
 userRouter.get('/projects',proptect, getAllProjects)
 userRouter.get('/projects/:projectId', proptect, getProjectsById)
 userRouter.get('/publish/: projectId', proptect, toggleProjectPublic)

 export default userRouter;