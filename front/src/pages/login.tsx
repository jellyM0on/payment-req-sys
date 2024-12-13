import AuthHeader from "../components/auth/authHeader";
import LoginForm from "../components/auth/loginForm";
import { useAuthContext } from "../providers/authProvider";
import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import { Stack, Container } from "@freee_jp/vibes";

function Login() {
  const { user, processDone } = useAuthContext();
  const [checkStatus, setCheckStatus] = useState(false);

  useEffect(() => {
    if (processDone) {
      setCheckStatus(true);
    }
  }, [processDone]);

  if (checkStatus && user == null) {
    console.log("no user");
    return (
      <Container>
        <Stack direction="vertical" justifyContent="center" alignItems="center">
          <AuthHeader />
          <LoginForm />
        </Stack>
      </Container>
    );
  }

  if (checkStatus && user) {
    console.log("yes user");
    return <Navigate to="/" />;
  }
}

export default Login;
