import { Outlet } from "react-router";
import NavBar from "../components/navigation/navBar";
import { useAuthContext } from "../providers/authProvider";
import { Navigate } from "react-router";

export default function Dashboard() { 
    const { user, loading } = useAuthContext();
    console.log(user)

    if(loading == false && user == null){
        console.log(user)
        return(
            <Navigate to="/login"/>
       )
    } 
    
    if(loading == false && user){
        console.log(user)
        return(
            <>
                <NavBar name={user.name} role={user.role}/>
                <Outlet/>
            </>
        ) 
    } 
}