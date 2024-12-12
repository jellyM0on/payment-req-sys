import { BiExit } from "react-icons/bi";
import RequestFormContainer from "../components/request/requestForm";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

interface Request{
    vendor_name: string | null
    vendor_address: string  | null
    vendor_tin: string  | null
    vendor_email: string  | null
    vendor_contact_num: string  | null
    vendor_certificate_of_reg: string  | null
    vendor_attachment: number  | null
    payment_due_date: string | null,
    payment_payable_to: string  | null
    payment_mode: string  | null
    purchase_category: string  | null
    purchase_description: string  | null
    purchase_amount: number  | null
  }

interface EditRequestProps{
    handleRequest: (requestData: Request) => Promise<any>
    existingRequest: Request | undefined
    mode: string
}
  
  
function EditRequest({handleRequest, existingRequest, mode} : EditRequestProps){
    return(
        <RequestFormContainer handleRequest={handleRequest} existingRequest={existingRequest} mode={mode}/>
    )
}

function EditRequestContainer(){
    const [request, setRequest] = useState<Request|null>(null)
    const { id } = useParams()

    const editRequest = async(requestData:Request) => {
        try{
          const response = await fetch(`http://localhost:3000/requests/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }, 
          credentials: 'include',
          body: JSON.stringify(requestData)
        }); 
    

        const result = await response.json()

        return result
    
       } catch(error) {
          console.log(error);
        }
    }

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
          setRequest({
            vendor_name: result.request.vendor_name, 
            vendor_address: result.request.vendor_address, 
            vendor_tin: result.request.vendor_tin,  
            vendor_email: result.request.vendor_email,
            vendor_contact_num: result.request.vendor_contact_num,
            vendor_certificate_of_reg: result.request.vendor_certificate_of_reg, 
            payment_due_date: result.request.payment_due_date,
            payment_payable_to: result.request.payment_payable_to,
            payment_mode: result.request.payment_mode,
            purchase_category: result.request.purchase_category,
            purchase_description: result.request.purchase_description,
            purchase_amount: result.request.purchase_amount,
            vendor_attachment: result.request.vendor_attachment
          })
        } 
    
       } catch(error) {
          console.log(error);
        }
      }

    useEffect(() => {
        getRequest()
    }, [])
    return (
          <EditRequest handleRequest={editRequest} existingRequest={request ? request : undefined} mode="edit"/>
    )
}

export default EditRequestContainer; 
