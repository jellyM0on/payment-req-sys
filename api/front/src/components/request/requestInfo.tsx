import { CardBase,
    SectionTitle,
    ButtonGroup,
    Button,
    HStack,
    DescriptionList,
    GridWrapper,
    GridBlock, 
    BackwardButton,
    MarginBase, 
    Text, 
    Paragraph, 
    StatusIcon,
} from "@freee_jp/vibes"
import { MdEdit } from "react-icons/md";
import { useAuthContext } from "../../providers/authProvider";
import { useState, useEffect } from "react";

interface RequestInfoProps{
    request: Request, 
    isEditable: false | string
  }

interface RequestInfoContainerProps{
    request: Request, 
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

function RequestInfo({request, isEditable} : RequestInfoProps){

    const setListItem = (label: string, value: string | number | null) => {
        return{
            title: <Text size={0.75}>{label}</Text>,
            value:  <Paragraph>{value}</Paragraph>,
        }
    }

    const setStatusItem = (label: string, value: string) => {
        return{
            title: <Text size={0.75}>{label}</Text>,
            value: setStatus(value)
        }
    }

    const setStatus = (status: string) => {
        switch (status){
          case "pending": 
            return (
              <StatusIcon type="progress">{status}</StatusIcon>
            )
          case "accepted": 
            return (
              <StatusIcon type="success">{status}</StatusIcon>
            )
          case "rejected": 
            return (
              <StatusIcon type="error">{status}</StatusIcon>
            )
        }
      }

    const setButton = (isEditable: string | false) => {
        console.log(isEditable); 
        if(!isEditable){
            return(
                <ButtonGroup  mt={1} mb={1} mr={1.5}>
                    <BackwardButton url="/">Back to Home</BackwardButton>
                </ButtonGroup>
            )
        }

        if(isEditable == "plain-mode"){
            return(
                <ButtonGroup  mt={1} mb={1} mr={1.5}>
                    <BackwardButton url="/">Back to Home</BackwardButton>
                    <Button IconComponent={MdEdit}>Edit</Button>
                </ButtonGroup>
            )
        }

        if(isEditable == "approval-mode"){
            return(
                <ButtonGroup  mt={1} mb={1} mr={1.5}>
                    <BackwardButton url="/">Back to Home</BackwardButton>
                    <Button appearance="primary">Approve</Button>
                    <Button danger >Reject</Button>
                </ButtonGroup>
            )
        }
    }


    return(
        <CardBase overflowHidden={false} paddingSize="zero">
        
            <MarginBase ml={-0.25} mr={-0.25} >
                <HStack justifyContent="space-between" alignItems="center">
                    <SectionTitle mt={2} mb={2} ml={1.5}>Vendor Information</SectionTitle>
                     {setButton(isEditable)}
                </HStack>

                <GridWrapper ma={0.25}>
                    <GridBlock size="half">
                        <DescriptionList listContents={[
                            setListItem("Vendor Name", request.vendor_name), 
                            setListItem("Address", request.vendor_address), 
                            setListItem("Contact No.", request.vendor_contact_num), 
                            setListItem("Attachment", request.vendor_attachment)
                        ]}
                    />
                    </GridBlock>
                    <GridBlock size="half">
                        <DescriptionList listContents={[
                            setListItem("Tax Identification Number (TIN)", request.vendor_tin), 
                            setListItem("Email Address", request.vendor_email), 
                            setListItem("Certificate of Registration", request.vendor_certificate_of_reg),
                            setListItem("","")
                        ]}
                    />
                    </GridBlock>
                </GridWrapper>
            </MarginBase>

            <MarginBase  ml={-0.25} mr={-0.25}>
                <HStack justifyContent="space-between">
                    <SectionTitle mt={2} mb={2} ml={1.5}>Purchase Description and Payment Instruction</SectionTitle>
                </HStack>

                <GridWrapper ma={0.25}>
                    <GridBlock size="half">
                        <DescriptionList listContents={[
                            setListItem("Category", request.purchase_category), 
                            setListItem("Description", request.purchase_description), 
                            setListItem("Amount", `PHP ${request.purchase_amount}`), 
                            setListItem("Supporting Documents", 0),
                        ]}
                    />
                    </GridBlock>
                    <GridBlock size="half">
                        <DescriptionList listContents={[
                            setListItem("Payment Due Date", request.payment_due_date), 
                            setListItem("Make Payable To", request.payment_payable_to), 
                            setListItem("Mode of Payment", request.payment_mode),
                            setListItem("","")
                        ]}
                    />
                    </GridBlock>
                </GridWrapper>
            </MarginBase>

            <MarginBase  ml={-0.25} mr={-0.25}>
                <HStack justifyContent="space-between">
                    <SectionTitle mt={2} mb={2} ml={1.5}>Request Info</SectionTitle>
                </HStack>

                <GridWrapper ma={0.25} >
                    <GridBlock size="half">
                        <DescriptionList listContents={[
                            setListItem("Request No.", request.id), 
                            setListItem("Date Submitted", request.created_at), 
                            setStatusItem("Status", request.overall_status),
                        ]}
                    />
                    </GridBlock>
                    <GridBlock size="half">
                        <DescriptionList listContents={[
                            setStatusItem("JM Approval Status", request.approvals[0].status),
                            setStatusItem("Accounting Approval Status", request.approvals[1].status),
                            setStatusItem("Admin Approval Status", request.approvals[2].status),
                        ]}
                    />
                    </GridBlock>
                </GridWrapper>
            </MarginBase>

            {/* to edit*/}
            <MarginBase mt={2} >&nbsp;</MarginBase>
        </CardBase>
    )
}

function RequestInfoContainer({request}: RequestInfoContainerProps){
    const { user } = useAuthContext(); 
    const [isEditable, setIsEditable] = useState<false | string>(false); 

    useEffect(() => {
        //user's own request
        if(user && request.user_id == user.id && !hasDecidedApproval()){
            setIsEditable("plain-mode")
        }

        //user is reviewer of request
        if(user && request.current_stage == getUserRole(user.role, user.department) && request.overall_status == "pending"){
                   console.log(isEditable); 
            setIsEditable("approval-mode")
        }

    }, [user])

    const getUserRole = (role :string, department: string) => {
        if(department == "accounting"){
            return "accountant"
        } else {
            return role
        }
    }

    const hasDecidedApproval = () => {
        let state = false; 
        request.approvals.forEach((approval) => {
            if (approval.status == "accepted" || approval.status == "rejected"){
                state = true;  
            }
        })
        return state;
    }

   

    return(
        <RequestInfo request = {request} isEditable = {isEditable}/>
    )
}
  
  export default RequestInfoContainer;