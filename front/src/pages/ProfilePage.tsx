import { useState } from "react";
import { Navigate} from "react-router-dom";
import axios from "axios";
import AccountNav from "../components/testRestAPI/AccountNav";
import { useRecoilState } from "recoil";
import { userAtom } from "../recoil/userAtom";

export default function ProfilePage() {
    const [user,setUser] = useRecoilState(userAtom);
    const [redirect,setRedirect] = useState('');

    // 로그아웃
    async function logout(){
        await axios.post('/logout')
        alert('로그아웃')
        setRedirect('/');
        setUser(null);
    }

    if (!user && !redirect) {
        return <Navigate to={'/login'} />
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div>
        <AccountNav/>
        <div className="text-center max-w-lg mx-auto">
            Logged in as {user?.name} ({user?.email})<br />
                <button onClick={logout} className="primary max-w-sm mt-2">
                    Logout
                </button>
            </div>
        </div>
  );
}