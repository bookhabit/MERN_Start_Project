import {Link, useNavigate} from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "./recoil/userAtom";
import { useEffect } from "react";
import axios from "axios";
import { UserType } from "./Types/userType";

export default function Header() {
  const [user,setUser] = useRecoilState(userAtom);
  const router = useNavigate();

  useEffect(() => {
    if (!user) {
      axios.get('/profile')
            .then(({data}:{data:UserType}) => {
              setUser(data);
            });
    }
  }, []);

  return (
    <header className="flex justify-between">
      <Link to={'/'} className="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 -rotate-90">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
        <span className="font-bold text-xl">헤더</span>
      </Link>
      {user ? (
        <div className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 cursor-pointer " onClick={()=>router('/account')}>
          <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            {user.name}
          </div>
        </div>
        ) : 
        <div className="flex gap-2">
          <Link to={'/register'} className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 ">
            회원가입
          </Link>
          <Link to={'/login'} className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 ">
            로그인
          </Link>
        </div>
        }      
         </header>
  );
}