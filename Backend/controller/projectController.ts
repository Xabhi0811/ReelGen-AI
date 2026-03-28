 import {Request, Response} from 'express'
 import * as Sentry from "@sentry/node"
import { prisma } from '../configs/prisma.js';
 import {v2 as cloudinary} from 'cloudinary'
 import { GenerateContentConfig  , HarmBlockThreshold, HarmCategory} from '@google/genai';
 import fs from 'fs';
import path from 'path';
import ai from '../configs/ai.js';




 const loadImage =(path: string, mimeType: string)=>{
   return{
      inlineData :{
         data: fs.readFileSync(path).toString('base64'),
         mimeType
      }
   }
 }

 export const createProject = async (req:Request, res: Response) =>{
     let tempProjectId: string;
     const {userId} = req.auth();
     let isCreditDeducted = false;

     const {name = 'New Project', aspectRatio, userPrompt, productName,
      productDescription, targetLength =5 } = req.body
      

      const images: any = req.file;

      if(images.length <2 || !productName){
         return res.status(400).json({message: 'Please upload at least 2 images'})

      }
      const user = await prisma.user.findUnique({
         where: {id: userId}
      })

      if(!user || user.credits <5){
         return res.status(401).json({message: "Insufficient credits"})
      } else{

         //deduct credits for image generation

         await prisma.user.update({
             where: {id: userId},
             data: {credits: {decrement: 5}}
         }).then(()=>{isCreditDeducted = true})
      }

    try {

         let uploadImages = await Promise.all(
            images.map(async(item: any)=>{
               let result = await cloudinary.uploader.upload(item.path,
                  {resource_type: 'image'})
                  return result.secure_url
            })
         )

         const project = await prisma.project.create({
            data:{
               name,
               userId,
               productDescription,
               userPrompt,
               aspectRatio,
               targetLength: parseInt(targetLength),
               uploadedImages,
               isGenerating: true
            }
         })

         tempProjectId = project.id;

         const model = 'gemini-3-pro-image-preview'

         const  GenerateContentConfig: GenerateContentConfig={
             maxOutputTokens: 32768,
             temperature: 1,
             topP: 0.95,
             responseModalities: ['IMAGE'],
             imageConfig:{
               aspectRatio: aspectRatio || '9:16',
               imageSize: '1k'
             },
             safetySettings: [
               {
                 category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                  threshold: HarmBlockThreshold.OFF,
                },

                {
                 category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                  threshold: HarmBlockThreshold.OFF,
                },

                {
                 category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                  threshold: HarmBlockThreshold.OFF,
                },

                 {
                 category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                  threshold: HarmBlockThreshold.OFF,
                },



             ]
         }
                
         //image base64 structure for ai model

         const img1base64 = loadImage(images[0].path, images[0].mimeType);
         const img2base64 = loadImage(images[1].path, images[1].mimeType);

         const prompt ={
            text: `Combine the person and product into a realistic photo.
            Make the person naturally hold or use the product.
            March lighting, shadows, scale and perspective.
            Male the person stand in professional studio lighting.
            Output ecommerce-quality photo realistic imagery.
            ${userPrompt}`
         }

         //Generate the image using the ai model
         const response: any = await ai.models.generateContent({
            model,
            contents: [img1base64, img2base64 , prompt],
            config: GenerateContentConfig
         })

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