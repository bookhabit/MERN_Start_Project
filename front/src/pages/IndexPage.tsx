import { useNavigate } from "react-router"

export default function IndexPage() {
  const router = useNavigate();
  return (
    <div>
      <div>
        메인페이지 - 게시글들 read 
      </div>
      <div className="w-20 bottom-5 right-5 fixed">
        <button className="bg-primary w-full p-2 text-white rounded-full" onClick={()=>router('/post/create')}>글 등록</button>
      </div>
    </div>
  )
}
