import UsersTableContainer from "../components/settings/usersTable";
import { useState, useEffect } from "react"

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
      <UsersTableContainer users={users} />
    </>
  );
  }

function SettingsContainer() {
  const [users, setUsers] = useState<Users[] | null>(null)

  useEffect(() => {
    getUsers()
  }, [])


  //????
  const handleUsersChange = () => {
    console.log("change")
    // if (!users) return 
    // const oldUserIndex = users.findIndex((cUser) => cUser.id == user.id)
    // console.log(oldUserIndex); 
    // users[oldUserIndex] = user
    // setUsers(users)
  }

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
  return(
    <>
        <Settings users={users} />
    </>
  )
}

export default SettingsContainer; 