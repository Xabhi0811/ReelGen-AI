import { useEffect, useState } from "react"
import type { Project } from "../types"
import { dummyGenerations } from "../assets/assets"
import { Loader2Icon } from "lucide-react"


const Community = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects =async ()=>{
    setTimeout(()=>{
      setProjects(dummyGenerations);
      setLoading(false)
    },3000)
  }

  useEffect(()=>{
   fetchProjects()
  },[])


  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2Icon className="size-7 animate-spin text-indigo-400" />
    </div>
  ) : (
    <div>

    </div>
  )
}

export default Community
