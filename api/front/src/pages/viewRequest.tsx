import RequestInfoContainer from "../components/request/requestInfo";
import { useParams } from "react-router";
import { useState, useEffect } from "react";

interface ViewRequestProps{
  request: Request | null
}

interface Request{
  id: number, 
  user_id: number, 
  current_stage: string, 
  vendor_name: string, 
  vendor_address: string, 
  vendor_tin: string, 
  vendor_email: string, 
  vendor_contact_num: string, 
  vendor_certificate_of_reg: string, 
  vendor_attachment: number, 
  payment_due_date: string | null, 
  payment_payable_to: string, 
  payment_mode: string, 
  purchase_category: string, 
  purchase_description: string, 
  purchase_amount: number, 
  created_at: string, 
  approvals: Approval[],
  overall_status: string
}

interface Approval{
  stage: string, 
  status: string
}

function ViewRequest({request} : ViewRequestProps) {
  // edit null, redirect to an error page
    return (
      request ? <RequestInfoContainer request={request}/> : null
    );
  }

function ViewRequestContainer(){
  let { id } = useParams()
  let [request, setRequest] = useState(null)

  useEffect(() => {
    getRequest()
    console.log(request)
    
  }, [])

  const getRequest = async() => {
      try{
        const response = await fetch(`http://localhost:3000/requests/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }, 
        credentials: 'include'
      }); 
  
      const result = await response.json()
  
      if (response.ok){
        setRequest(result.request)
      } 
  
     } catch(error) {
        console.log(error);
      }
    }

    return (
        <ViewRequest request={request}/>
    )
}

  export default ViewRequestContainer

