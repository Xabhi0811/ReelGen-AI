 import {Request, Response} from 'express'
 import * as Sentry from "@sentry/node"
import { prisma } from '../configs/prisma.js';
 import {v2 as cloudinary} from 'cloudinary'
 import { GenerateContentConfig  , HarmBlockThreshold, HarmCategory} from '@google/genai';
 import fs from 'fs';
import path from 'path';
import ai from '../configs/ai.js';
import axios from 'axios';
import { error } from 'console';




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

         //check if the respnse is valid
         if(!response?.candidates?.[0]?.content?.parts){
            throw new Error('Unexpected response')
         }
      
         const parts = response.candidates[0].content.parts;
         let finalBuffer: Buffer | null = null

         for(const part of parts){
            if(part.inlineData){
               finalBuffer = Buffer.from(part.inlineData.data, 'base64')
            }
         }
           if(!finalBuffer){
            throw new Error('Failed to generate image');
           }

           const base64Image = `data:image/png;base64,${finalBuffer.toString('base64')}`

           const uploadResult = await cloudinary.uploader.upload(base64Image,{resource_type: 'image'});
            
           await prisma.project.update({
            where: {id: project.id},
            data: {
               generatedImage: uploadResult.secure_url,
               isGenerating: false
            }
           })

            res.json({projectId: project.id})
    } catch (error:any) {
        if(tempProjectId!){
         //update project status and error message

         await prisma.project.update({
            where: {id: tempProjectId},
            data: {isGenerating: false, error: error.message}
         })
        }
         
        if(isCreditDeducted){
         //add credits back
         await prisma.user.update({
            where: {id: userId},
            data: { credits: {increment: 5}}
         })

        }



        Sentry.captureException(error);
       res.status(500).json({message: error.message})
        
    }
 }



 export const createVideo = async (req:Request, res: Response) =>{

   const {userId} = req.auth()
   const {projectId} = req.body;
   let isCreditDeducted = false

   const user = await prisma.user.findUnique({
      where: {id: userId}
   })  
   if(!user || user.credits <10){
      return res.status(401).json({message: 'Insufficient credits'})
   }

   // deduct credits for video generation
    await prisma.user.update({
      where: {id: userId},
      data: {credits: {decrement:10}}
    }).then(()=>{isCreditDeducted = true});


    try {
      const project = await prisma.project.findUnique({
         where: {id: projectId, userId},
         include: {user: true}
      })

      if(!project || project.isGenerating){
         return res.status(404).json({message: 'Generation im progress'})
      }
      if(project.generatedVideo){
         return res.status(404).json({message: 'Video already generated'})
      }   

      await prisma.project.update({
         where: {id: projectId},
         data: {isGenerating: true}
      })

      const prompt =`make the person showcase the product 
      which is ${project.productName}
      ${project.productDescription && `and Product
       Description: ${project.productDescription}`}`

       const model = 'veo-3.1-generate-preview'
        
       if(!project.generatedImage){
         throw new Error('Generated image not found')
       }

       const image = await axios.get(project.generatedImage, {responseType: 'arraybuffer',})

       const imageBytes: any = Buffer.from(image.data)

       let operation: any = await ai.models.generateVideos({
         model,
         prompt,
         image:{
            imageBytes: imageBytes.toString('base64'),
            mimeType: 'image/png',
         },
         config:{
            aspectRatio: project?.aspectRatio || '9:16',
            numberOfVideos: 1,
            resolution: '720p',
         }

       })

       while(!operation.done){
         console.log('Waiting for video generation to complete...');
         operation = await ai.operations.getVideosOperation({
            operation: operation,
         })
       }

       const filename = `${userId}-${Date.now()}.mp4`;
       const filePath = path.join('videos',filename)

       // Create the images direstory if it doesnot exist
       fs.mkdirSync('videos', {recursive: true})

       if(!operation.response.generatedVideo){
         throw new Error(operation.response.raiMediaFilteredReasons[0])
       }

       //Download the video.
       await ai.files.download({
         file: operation.response.generateVideos[0].video,
         downloadPath: filePath,
       })

       const uploadResult = await cloudinary.uploader.upload(filePath,{
         resource_type: 'video'
       });

       await prisma.project.update({
         where: {id: project.id},
         data:{
            generatedVideo: uploadResult.secure_url,
            isGenerating: false
         }
       })
         
       //remove video file from disk after upload
       fs.unlinkSync(filePath);


       res.json({message: 'Video generation completed',videoUrl: uploadResult.secure_url})

        
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