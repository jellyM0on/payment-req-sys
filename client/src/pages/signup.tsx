import AuthHeader from "../components/auth/authHeader"
import SignupForm from "../components/auth/signupForm"

function Signup() {

    return(
        <main className="login-page">
          <AuthHeader/>
          <SignupForm/>
        </main>
    ); 
}

export default Signup