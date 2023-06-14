import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { PostData } from "../Types/PostType";
import axios from "axios";
import PostGallery from "../components/testRestAPI/PostGallery";

export default function PostDetail() {
    const {id:postId} = useParams();
    const [post,setPost] = useState<PostData|null>(null);

    useEffect(()=>{
        if(!postId){
            return;
          }
          axios.get(`/post/${postId}`).then(response=>{
            setPost(response.data) 
          })
    },[])

    if (!post) return '숙소 불러오지 못함';

    return(
        <div className="mt-4 bg-gray-100 -mx-8 px-8 py-8">
        <h1 className="text-3xl">{post.title}</h1>
        <PostGallery post={post} />
        <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]"> 
            <div className="my-4">
                <h2 className="font-semibold text-2xl">
                    Description
                </h2>
                <div>
                    {post.description}
                </div>
            </div>
        </div>
      </div>
    )
}