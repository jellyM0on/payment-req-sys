import SignupForm from "../components/auth/signupForm";
import { Stack } from "@freee_jp/vibes";

function CreateUser() {
  return (
    <Stack justifyContent="center" alignItems="center">
      <SignupForm />
    </Stack>
  );
}

function CreateUserContainer() {
  return <CreateUser />;
}

export default CreateUserContainer;
