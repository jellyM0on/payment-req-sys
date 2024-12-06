import AuthHeader from "../components/auth/authHeader"
import SignupForm from "../components/auth/signupForm"
import { Container, Stack } from "@freee_jp/vibes";

function Signup() {

    return(
      <Container>
        <Stack direction="vertical" justifyContent="center" alignItems="center">
          <AuthHeader/>
          <SignupForm/>
        </Stack>
  </Container>
    ); 
}

export default Signup