import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import UserForm from "../components/settings/userForm";
import { Container } from "@freee_jp/vibes";

interface User {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  role: string;
  manager?: Manager;
}

interface Manager {
  id: number;
  name: string;
}

interface EditUserProps {
  user: User | null;
}

function EditUser({ user }: EditUserProps) {
  return (
    <Container>
      <UserForm user={user} />
    </Container>
  );
}

function EditUserContainer() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate()

  const redirectError = () => {
    navigate('/404')
  }

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setUser(result);
      } else {
        redirectError(); 
      }
    } catch (error) {
      console.log(error);
      redirectError(); 
    }
  };
  return <EditUser user={user} />;
}

export default EditUserContainer;
