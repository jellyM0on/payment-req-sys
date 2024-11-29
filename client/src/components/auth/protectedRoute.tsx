import { Navigate } from "react-router";
import { useAuthContext } from "../../providers/authProvider";
import { FC } from "react";

interface ProtectedRouteProps{
    children: JSX.Element
}

const ProtectedRoute : FC<ProtectedRouteProps> = ({ children }) => {
    if(!sessionStorage.user){
        return <Navigate to="/login"/>
    }
    return children; 
}

export default ProtectedRoute