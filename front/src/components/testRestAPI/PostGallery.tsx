import { useState } from "react";
import Image from "./Image";
import { PostData } from "../../Types/PostType";

interface IProps{
  post:PostData
}

export default function PostGallery({post}:IProps){
    const [showAllPhotos,setShowAllPhotos] = useState(false)


    if (showAllPhotos) {
      return (
      <div className="absolute inset-0 bg-black text-white min-h-screen">
        <div className="bg-black p-8 grid gap-4">
          <div>
            <h2 className="text-3xl mr-48">Photos of {post.title}</h2>
            <button onClick={() => setShowAllPhotos(false)} className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
              Close photos
            </button>
          </div>
          {post?.photos?.length > 0 && post.photos.map(photo => (
            <div>
              <Image src={photo}/>
            </div>
          ))}
        </div>
      </div>
      );
    }

    return(
        <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden mt-4
        ">
          {post.photos.map((photo,index)=>(
            index===0 && 
            <div key={photo}>
                <img 
                  onClick={()=>setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover" 
                  src={'http://localhost:4000/uploads/'+photo}
                  alt="이미지"/>
            </div>
          ))}
          <div className="grid gap-1">  
            {post.photos.map((photo,index)=>(
              index===1 && 
                  <img 
                    onClick={()=>setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover" 
                    src={'http://localhost:4000/uploads/'+photo}
                    alt="이미지"/>
            ))}
            <div className="overflow-hidden">
            {post.photos.map((photo,index)=>(
              index===2 && 
                  <img 
                    onClick={()=>setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover" 
                    src={'http://localhost:4000/uploads/'+photo}
                    alt="이미지"/>
            ))}
            </div>
          </div>
        </div>
        <button className="absolute flex gap-1 bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-gray-500" onClick={()=>setShowAllPhotos(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
          Show more photos
        </button>
      </div>
    )
}