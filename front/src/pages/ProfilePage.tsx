import { useContext, useState } from "react";
import { Navigate} from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";
import AccountNav from "../components/testRestAPI/AccountNav";

export default function ProfilePage() {
    const {user,setUser} = useContext(UserContext)
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