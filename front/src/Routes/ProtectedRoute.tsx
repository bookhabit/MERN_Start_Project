import { useRecoilValue } from "recoil";
import { userAtom } from "../recoil/userAtom";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
    const user = useRecoilValue(userAtom)
    
    return user ? <Outlet/> :<Navigate to="/login" replace/>
};

export default ProtectedRoute;