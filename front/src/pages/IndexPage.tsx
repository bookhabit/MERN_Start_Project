
import { useEffect, useState } from "react";
import { PostData } from "../Types/PostType";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Image from "../components/testRestAPI/Image";
import { useRecoilValue } from "recoil";
import { userAtom } from "../recoil/userAtom";

export default function IndexPage() {
  const router = useNavigate();
  const user = useRecoilValue(userAtom)
  const [posts,setPosts] = useState<PostData[]>([]);
  useEffect(()=>{
    axios.get('/posts').then(response=>{
      setPosts(response.data)
    })
  },[])
  return (
    <div className="relative h-screen">
      <div className="mt-8 grid gap-x-6 gap-y-8 xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {posts.length > 0 && posts.map(post => (
        <Link to={'/post/'+post._id} key={post._id}>
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
            {post.photos?.[0] && (
              <Image className="rounded-2xl object-cover aspect-square" src={post.photos?.[0]}/>
            )}
          </div>
          <h3 className="text-md text-gray-800">{post.title.length>15 ? post.title.slice(0,15)+' ...' :post.title}</h3>
        </Link>
      ))}
      </div>
      {user && (
        <div className="absolute w-20 bottom-0 right-0">
          <div className="flex flex-col gap-8 items-center">
            <button className="bg-primary w-full p-2 text-white rounded-full" onClick={()=>router('/chat')}>
              채팅페이지 이동
            </button>
            <button className="bg-primary w-full p-2 text-white rounded-full" onClick={()=>router('/post/create')}>
              글 등록
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
