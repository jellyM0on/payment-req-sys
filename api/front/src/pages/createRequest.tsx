import RequestFormContainer from "../components/request/requestForm";


interface CreateRequestProps{
  handleRequest: (requestData: Request) => Promise<any>
  mode: string
}

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




function CreateRequest({handleRequest, mode}: CreateRequestProps) {
    return (
     <RequestFormContainer handleRequest={handleRequest} mode={mode}/>
    );
  }

function CreateRequestContainer() {

  const createRequest = async(requestData:Request) => {
    try{
      const response = await fetch(`http://localhost:3000/requests`, {
      method: 'POST',
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

    return (
      <CreateRequest handleRequest={createRequest} mode="new"/>
    );
  }


export default CreateRequestContainer