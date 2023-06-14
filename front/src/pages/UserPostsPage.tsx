import { useEffect, useState } from "react"
import Image from "../components/testRestAPI/Image"
import { Link } from "react-router-dom"
import AccountNav from "../components/testRestAPI/AccountNav"
import axios from "axios"
import { PostData } from "../Types/PostType"

export default function UserPostsPage(){
    const [userPosts,setUserPosts] = useState<PostData[]>([])
    useEffect(()=>{
        axios.get('/user-posts').then(response=>{
            setUserPosts(response.data)
        })
    },[])
    return(
        <>
             <AccountNav/>
            <div className="text-center max-w-lg mx-auto">
                {userPosts && (
                    <div className="mt-8 grid gap-x-6 gap-y-8 xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {userPosts.length > 0 && userPosts.map(post => (
                      <Link to={'/post/update/'+post._id}>
                        <div className="bg-gray-500 mb-2 rounded-2xl flex">
                          {post.photos?.[0] && (
                            <Image className="rounded-2xl object-cover aspect-square" src={post.photos?.[0]}/>
                          )}
                        </div>
                        <h3 className="text-md text-gray-800">{post.title.length>15 ? post.title.slice(0,15)+' ...' :post.title}</h3>
                      </Link>
                    ))}
                    </div>
                )}
            </div>
        </>
    )
}