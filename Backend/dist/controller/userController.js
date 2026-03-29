import * as Sentry from "@sentry/node";
import { prisma } from '../configs/prisma.js';
//get user credits
export const getUserCredits = async (req, res) => {
    try {
        const userId = req.userId || req.auth()?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        res.json({ credits: user?.credits });
    }
    catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.code || error.message });
    }
};
//const get all user prject
export const getAllProjects = async (req, res) => {
    try {
        const userId = req.userId || req.auth()?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const projects = await prisma.project.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ projects });
    }
    catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.code || error.message });
    }
};
//get project by id 
export const getProjectsById = async (req, res) => {
    try {
        const userId = req.userId || req.auth()?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const projectId = String(req.params.projectId || '');
        const project = await prisma.project.findFirst({
            where: { id: projectId, userId }
        });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ project });
    }
    catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.code || error.message });
    }
};
//publish /unpublish project
export const toggleProjectPublic = async (req, res) => {
    try {
        // Use userId from auth middleware
        const userId = req.userId || req.auth()?.userId;
        const projectId = String(req.params.projectId || '');
        console.log('DEBUG toggleProjectPublic:', { projectId, userId });
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const project = await prisma.project.findFirst({
            where: { id: projectId, userId }
        });
        if (!project) {
            const existingProject = await prisma.project.findUnique({
                where: { id: projectId },
                select: { id: true, userId: true }
            });
            if (existingProject) {
                return res.status(403).json({ message: `You are not allowed to publish this project (owner: ${existingProject.userId})` });
            }
            return res.status(404).json({ message: `Project not found: ${projectId}` });
        }
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: { isPublished: !project.isPublished }
        });
        console.log('DEBUG Project published:', projectId, updatedProject.isPublished);
        res.json({ isPublished: updatedProject.isPublished });
    }
    catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.code || error.message });
    }
};
