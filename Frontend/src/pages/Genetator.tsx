import { useState } from "react"
import Title from "../components/Title"
import UploadZone from "../components/uploadZone"
import { Loader2Icon, RectangleHorizontalIcon, RectangleVerticalIcon, Wand2Icon } from "lucide-react"
import { PrimaryButton } from "../components/Buttons"
import { useAuth, useUser } from "@clerk/react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import api from "../configs/axios"



const Genetator = () => {

  const {user} = useUser()
  const {getToken} = useAuth()
  const navigate =useNavigate()

  const [name, setName] =useState('')
  const[productName, setProuctName] =useState('')
  const[productDescripation, setProuctDescripation] = useState('')
  const[aspectRatio, setAspectRatio] = useState('9:16')
  const [productImage, setProductImage] = useState<File |null>(null)
  const [modelImage, setModelImage] = useState<File |null>(null)
  const[userPrompt, setUserPrompt] = useState('')
  const [isGenerating, setIsGenerating] =  useState(false)

  const handleFileChange =(e: React.ChangeEvent<HTMLInputElement>,
    type:'product' |'model')=>{
    if(e.target.files&& e.target.files[0]){
      if(type === 'product') setProductImage(e.target.files[0])
        else setModelImage(e.target.files[0])
    }
  }
    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      if(!user) return toast('Please login to generate')

        if(!productImage || !modelImage ||!name|| !productName || !aspectRatio)
          return toast('please fill all the required fields')

        try {
          setIsGenerating(true);
          const fromData = new FormData();

          fromData.append('name', name)
          fromData.append('productName', productName)
          fromData.append('productDescription',productDescripation)
           fromData.append('userPrompt',userPrompt)
            fromData.append('aspectRatio',aspectRatio)
             fromData.append('images',productImage)
             fromData.append('modelImage', modelImage)
          
          const token = await getToken()

          const {data} = await api.post('/api/project/create', fromData,{
            headers: {Authorization: `Bearer ${token}`}
          })

          toast.success(data.message)
         navigate('/result/' + data.projectId)
          
        } catch (error: any) {
          setIsGenerating(false);
          toast.error(error?.response?.data?.message || error.message)
        }
    }

  
  return (
    <div className="min-h-screen text-white p-6 md:p-13 mt-28">
      <form onSubmit={handleGenerate} className="max-w-4xl mx-auto mb-40">
        <Title heading="create In-Context Image" description="upload
        your model and product images to generate stunning UGC,
        short-form videos and social media posts"/>
      
      <div className="flex gap-20 max-sm:flex-col items-start justify-between">
        {/* left col*/ }
        <div className="flex flex-col w-full sm:max-w-60 gap-8 mt-8 mb-12">
            <UploadZone label="Product Image" file={productImage} onClear={()=>setProductImage(null)}
             onChange={(e)=>handleFileChange(e, 'product')}/>

             <UploadZone label="Model Image" file={modelImage} onClear={()=>setModelImage(null)}
             onChange={(e)=>handleFileChange(e, 'model')}/>
        </div>
        {/* lright col*/ }
        <div className="w-full">
            <div className="mb-4 text-gray-300">
              <label htmlFor="Name" className="block text-sm mb-4">Project Name</label>
              <input type="text" id="name" value={name} 
              onChange={(e)=>setName(e.target.value)} placeholder="Name your project"
              className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm
              border-violet-200/10 focus:border-violet-500/50 outline-none
              transition-all"/>
            </div>

            <div className="mb-4 text-gray-300">
              <label htmlFor="productName" className="block text-sm mb-4">Product Name</label>
              <input type="text" id="productName" value={productName} 
              onChange={(e)=>setProuctName(e.target.value)} placeholder="Enter the name of product"
              className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm
              border-violet-200/10 focus:border-violet-500/50 outline-none
              transition-all"/>
            </div>

             <div className="mb-4 text-gray-300">
              <label htmlFor="productDescripation" className="block text-sm mb-4">
                Product Descripation<span className="text-xs text-violet-400"> (optional) </span></label>
              <textarea id="ProuctDescripation" rows={4}
               value={productDescripation}
              onChange={(e)=>setProuctDescripation(e.target.value)}
              placeholder="Enter the description of the product" 
              className="w-full bg-white/3 rounded-lg border-2 p-4
              text-sm border-violet-200/10 focus:border-violet-500/50 outline-none
              resize-none transition-all" />
            </div>

            <div className="mb-4 text-gray-300">
              <label className="block text-sm mb-4">Aspect Ratio</label>
              <div className="flex gap-3">
                <RectangleVerticalIcon onClick={()=>setAspectRatio('9:16')}
                  className={`p-2.5 size-13 bg-white/6 rounded transition-all ring-2
                  ring-transparent cursor-pointer${aspectRatio === '9:16' ? "ring-violet-500/50 bg-white/10": ''}`}/>

                  <RectangleHorizontalIcon onClick={()=>setAspectRatio('16:9')}
                  className={`p-2.5 size-13 bg-white/6 rounded transition-all ring-2
                  ring-transparent cursor-pointer${aspectRatio === '16:9' ? "ring-violet-500/50 bg-white/10": ''}`}/>
              </div>
            </div>

             <div className="mb-4 text-gray-300">
              <label htmlFor="userPrompt" className="block text-sm mb-4">
                User Prompt<span className="text-xs text-violet-400"> (optional) </span></label>
              <textarea id="userPrompt" rows={4}
               value={userPrompt}
              onChange={(e)=>setUserPrompt(e.target.value)}
              placeholder="Describle how you want the narration to be." 
              className="w-full bg-white/3 rounded-lg border-2 p-4
              text-sm border-violet-200/10 focus:border-violet-500/50 outline-none
              resize-none transition-all" />
            </div>

        </div>
      </div>
      <div className="flex justify-center mt-10">
        <PrimaryButton disabled={isGenerating} className="px-10 py-3 rounded-md
         disabled:opacity-70 disabled:cursor-not-allowed">
          {isGenerating ? (<><Loader2Icon className="size-5 animate-spin"/>
             Generating.... </>
          ) :(<> <Wand2Icon className="size-5"/>Generating Image</>)}
        </PrimaryButton>
      </div>
      </form>
    </div>
  )
}

export default Genetator
