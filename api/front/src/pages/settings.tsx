import UsersTableContainer from "../components/settings/usersTable";
import UsersTableHeaderContainer from "../components/settings/usersTableHeader";
import { useState, useEffect } from "react"
import { useLocation } from "react-router";
import { FloatingMessageBlock, Text } from "@freee_jp/vibes";

interface Users{
  id: number, 
  name: string, 
  email: string, 
  position: string, 
  department: string, 
  role: string,
  manager?: Manager
}

interface Manager{
  id: number, 
  name: string
}

interface SettingsPropsInterface{
  users: Users[] | null
}


function Settings({users}: SettingsPropsInterface) {
  return (
    <>
      <UsersTableHeaderContainer/>
      <UsersTableContainer users={users} />
    </>
  );
  }

function SettingsContainer() {
  const [users, setUsers] = useState<Users[] | null>(null)

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async() => {
    try{
      const response = await fetch("http://localhost:3000/users", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }, 
      credentials: 'include'
    }); 

    const result = await response.json()
    
    if(response.ok){
      setUsers(result.users)
    }

    } catch(error) {
      console.log(error);
    }
  }

  function NewUserMsg(){
    return(
      <FloatingMessageBlock success>
        <Text>New user created successfully.</Text>
      </FloatingMessageBlock>
    )
  }

  const location = useLocation(); 

  return(
    <>
        <Settings users={users} />
        {location.state && location.state.hasNewUser == true ? <NewUserMsg/>: <></>}
    </>
  )
}

export default SettingsContainer; 