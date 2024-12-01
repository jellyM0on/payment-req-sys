import AuthHeader from "../components/auth/authHeader"
import LoginForm from "../components/auth/loginForm"
import { useAuthContext } from "../providers/authProvider";
import { useState, useEffect } from "react";
import { Navigate } from "react-router";

function Login() {

  const { user, processDone } = useAuthContext();
  const [checkStatus, setCheckStatus] = useState(false); 

  useEffect(() => {

    if(processDone){
      setCheckStatus(true); 
    }

}, [processDone])

  if(checkStatus && user == null){
    console.log('no user')
    return(
       <main className="login-page">
          <AuthHeader/>
          <LoginForm/>
        </main>
    )
  }

  if(checkStatus && user){
    console.log('yes user')
    return(
      <Navigate to="/"/>
    )
  }
}

export default Login