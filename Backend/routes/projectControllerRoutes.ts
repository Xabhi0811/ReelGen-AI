import express from 'express'
import { proptect } from '../middlewares/auth.js'
import { createProject, createVideo, deleteProject, getAllPublishedProjects } from '../controller/projectController.js'


const projectRouter = express.Router()

projectRouter.post('/create', proptect, createProject)
projectRouter.post('/video', proptect, createVideo)
projectRouter.get('/published', getAllPublishedProjects)
projectRouter.delete('/:projectId', proptect, deleteProject)

export default projectRouter