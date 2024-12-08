import RequestTable from "../components/request/requestTable";
import { useEffect, useState } from "react";

interface HomePropsInterface{
  requests: Request[] | null
}

interface Request{
  id: number, 
  overall_status: string, 
  user: User, 
  purchase_category: string, 
  department: string, 
  current_stage: string, 
  approvals: Approval[]
}

interface User{
  department: string, 
  name: string,
}

interface Approval{
  reviewer : { name: string }
}

function Home({requests} : HomePropsInterface){
  return (
    <>
      <RequestTable requests = {requests}/>
    </>
  )
}

export default function HomeContainer() {
  const [requests, setRequests] = useState(null)
  const [pageMeta, setPageMeta] = useState(null)

  useEffect(() => {
    getRequests()
    console.log(requests); 
    console.log(pageMeta); 
  }, [])

  const getRequests = async() => {
    try{
      const response = await fetch("http://localhost:3000/requests", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }, 
      credentials: 'include'
    }); 

    const result = await response.json()

    setRequests(result.requests)
    setPageMeta(result.pagination_meta)
    // return result
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <>
       <Home requests = {requests}/>
    </>
  );
}