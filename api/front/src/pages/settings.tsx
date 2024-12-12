import UsersTableContainer from "../components/settings/usersTable";
import UsersTableHeaderContainer from "../components/settings/usersTableHeader";
import { useState, useEffect } from "react"
import { useLocation } from "react-router";
import { FloatingMessageBlock, Text, MarginBase } from "@freee_jp/vibes";
import PageSelection from "../components/utils/pageSelection";

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
  pageMeta: PageMeta | null
  handlePageChange: (page:number) => void
}
interface PageMeta{
  current_page: number
  next_page: number
  total_pages: number
  total_count: number
}


function Settings({users,  pageMeta, handlePageChange}: SettingsPropsInterface) {
  return (
    <>
    <MarginBase>
      <UsersTableHeaderContainer/>
      <UsersTableContainer users={users} />
    </MarginBase>
    <PageSelection pageMeta={pageMeta} handlePageChange={handlePageChange}/>
    
    </>
  );
  }

function SettingsContainer() {
  const [users, setUsers] = useState<Users[] | null>(null)
  const [pageMeta, setPageMeta] = useState(null)

  useEffect(() => {
    getUsers(1)
  }, [])

  const getUsers = async(page:number) => {
    try{
      const response = await fetch(`http://localhost:3000/users/?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }, 
      credentials: 'include'
    }); 

    const result = await response.json()
    
    if(response.ok){
      setUsers(result.users)
      setPageMeta(result.pagination_meta)
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

  const handlePageChange = (page:number) => {
    getUsers(page)
  }


  const location = useLocation(); 

  return(
    <>
        <Settings users={users} pageMeta={pageMeta} handlePageChange={handlePageChange} />
        {location.state && location.state.hasNewUser == true ? <NewUserMsg/>: <></>}
    </>
  )
}

export default SettingsContainer; 