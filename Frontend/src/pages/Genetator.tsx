import Title from "../components/Title"


const Genetator = () => {
  return (
    <div className="min-h-screen text-white p-6 md:p-13 mt-28">
      <form className="max-w-4xl mx-auto mb-40">
        <Title heading="create In-Context Image" description="upload
        your model and product images to generate stunning UGC,
        short-form videos and social media posts"/>
      </form>
      <div className="flex gap-20 max-sm:flex-col items-start justify-between">
        {/* left col*/ }
        <div className="flex flex-col w-full sm:max-w-60 gap-8 mt-8 mb-12">
            <p>product image</p>
            <p>model image</p>
        </div>
        {/* lright col*/ }
        <div className="">
            <p>right col</p>
        </div>
      </div>
      
    </div>
  )
}

export default Genetator
