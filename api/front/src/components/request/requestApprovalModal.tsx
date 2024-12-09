import { 
    FloatingMessageBlock,
    MessageDialogConfirm,
    Text
} 
from "@freee_jp/vibes"

import { useState } from "react"

interface RequestApprovalModalProps{
    handleClose: () => void, 
    handleConfirm: () => void, 
    isOpen: boolean, 
    vendorName: string, 
    id: number
}

interface RequestApprovalModalContainerProps{
    handleRequestUpdate: (request: Request) => void
    handleClose: () => void, 
    handleChangeEditable: () => void,
    isOpen: boolean,
    vendorName: string, 
    id: number,
    approvalId:  number | null,
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
    id: number,
    stage: string, 
    status: string,
    updated_at: string
  }

  interface RequestMsgProps{
    // isUpdated: boolean, 
    id: number
  }


function RequestApprovalModal({handleClose, handleConfirm, isOpen, id, vendorName} : RequestApprovalModalProps){

    return(
       <MessageDialogConfirm id={"test"} title="Confirm Approval" closeButtonLabel="Cancel" confirmButtonLabel="Approve" 
       isOpen={isOpen} onRequestClose={handleClose} onConfirm={handleConfirm}>
            <Text>You are about to approve Request No. {id} for {vendorName}.</Text>
       </MessageDialogConfirm>
    )
}

function RequestMsg({id}: RequestMsgProps ){
    return(
        <FloatingMessageBlock success>
            <Text>Payment Request No. {id} has been approved</Text>
        </FloatingMessageBlock>
    )
}

function RequestApprovalModalContainer({isOpen, vendorName, id, approvalId, handleClose, handleRequestUpdate, handleChangeEditable} : RequestApprovalModalContainerProps){

    const [isUpdated, setIsUpdated] = useState(false); 

    const handleConfirm = () => {
        updateStatus("accepted"); 
    }

    const updateStatus = async(status: string) => {
        try{
            const response = await fetch(`http://localhost:3000/requests/${id}/approvals/${approvalId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            }, 
            credentials: 'include',
            body: JSON.stringify({status: status})
          }); 
      
          const result = await response.json()

          console.log(result)
      
          if (response.ok){
            handleClose()
            handleRequestUpdate(result)
            handleChangeEditable()
            setIsUpdated(true)
          } 
      
          } catch(error) {
            console.log(error);
          }
    }

    return(
        <>
          { isUpdated ? <RequestMsg id={id} /> : <> </>}
          <RequestApprovalModal
            handleClose={handleClose} 
            handleConfirm={handleConfirm}
            isOpen={isOpen}
            vendorName={vendorName}
            id={id}
        />  
        </>
       
    )
}

export default RequestApprovalModalContainer; 