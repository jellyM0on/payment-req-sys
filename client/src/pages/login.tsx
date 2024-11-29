import AuthHeader from "../components/auth/authHeader"
import LoginForm from "../components/auth/loginForm"

function Login() {

    return(
        <main className="login-page">
          <AuthHeader/>
          <LoginForm/>
        </main>
    ); 
}

export default Login