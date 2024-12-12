import RequestTable from "../components/request/requestTable";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { FloatingMessageBlock, Text } from "@freee_jp/vibes";

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
  reviewer : { name: string },
  stage: string
}

function Home({requests} : HomePropsInterface){
  return (
    <>
      <RequestTable requests = {requests}/>
    </>
  )
}

function NewRequestMsg(){
  return(
    <FloatingMessageBlock success onClose={() => {

    }}>
      <Text>Your Payment Request has been submitted successfully.</Text>
    </FloatingMessageBlock>
  )
}

function EditedRequestMsg(){
  return(
    <FloatingMessageBlock success onClose={() => {

    }}>
      <Text>Your Payment Request has been edited successfully.</Text>
    </FloatingMessageBlock>
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

    if (response.ok){
      setRequests(result.requests)
      setPageMeta(result.pagination_meta)
    } 

    // return result
    } catch(error) {
      console.log(error);
    }
  }

  const location = useLocation(); 

  return (
    <>
       <Home requests = {requests}/>
       {location.state && location.state.hasNewRequest == true ? <NewRequestMsg/>: <></>}
       {location.state && location.state.hasEditedRequest == true ? <EditedRequestMsg/>: <></>}
    </>
  );
}