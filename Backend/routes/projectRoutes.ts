import express from 'express'
import { proptect } from '../middlewares/auth.js'
import { createProject, createVideo, deleteProject, getAllPublishedProjects } from '../controller/projectController.js'
import upload from '../configs/multer.js'


const projectRouter = express.Router()

projectRouter.post(
	'/create',
	upload.fields([
		{ name: 'images', maxCount: 2 },
		{ name: 'modelImage', maxCount: 1 },
		{ name: 'productImage', maxCount: 1 },
	]),
	proptect,
	createProject
)
projectRouter.post('/video', proptect, createVideo)
projectRouter.get('/published', getAllPublishedProjects)
projectRouter.delete('/:projectId', proptect, deleteProject)

export default projectRouter