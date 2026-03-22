import { useNavigate } from "react-router-dom"
import type { Project } from "../types"
import { useState } from "react";


const ProjectCard = ({gen, setGenerations, forCommunity = false}: 
    {gen: Project, setGenerations: React.Dispatch<React.SetStateAction<Project[]>>,forCommunity?:boolean}) => {

        const navigate = useNavigate();
        const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div key={gen.id} className="mb-4 break-inside-avoid">
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden
      hover:border-white/20 transition group">
        {/*preview */}
        <div className={`${gen?.aspectRatio === '9:16' ? 'aspect-9/16' :
         'aspect-video'}
        relative overflow-hidden`}>
        {gen.generatedImage &&(
         <img src={gen.generatedImage} alt={gen.productName}
          className={`absolute inset-0 w-full h-full object-cover transition 
            duration-500 ${gen.generatedVideo ? 'group-hover:opacity-0' :
                'group-hover:scale-105'}`}/>
        )}</div>
         {/*details */}
         <div className=""></div>
      </div>
    </div>
  )
}

export default ProjectCard
