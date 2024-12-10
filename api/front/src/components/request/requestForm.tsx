import { 
  WithTOC, 
  AccordionPanel, 
  Stack, 
  DescriptionList,
  SectionTitle, 
  FormControlLabel, 
  TextField, 
  FormControlGroup, 
  RadioButton, 
  DateInput, 
  DropdownButton, 
  Text, 
  Message,
  CardBase, 
  ButtonGroup, 
  Button,
  TextFieldType, 
  FloatingMessageBlock
 } from "@freee_jp/vibes";

 import { RequiredIcon } from "@freee_jp/vibes";
 import { useState } from "react";
import { useAuthContext } from "../../providers/authProvider";
import { useNavigate } from "react-router";

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

interface RequestErrors{
  vendor_name?:  Array<string> 
  vendor_address?:  Array<string> 
  vendor_tin?:  Array<string> 
  vendor_email?:  Array<string> 
  vendor_contact_num?:  Array<string> 
  vendor_certificate_of_reg?: Array<string> 
  vendor_attachment?:  Array<string> 
  payment_due_date?:  Array<string> 
  payment_payable_to?: Array<string> 
  payment_mode?:  Array<string> 
  purchase_category?:  Array<string> 
  purchase_description?: Array<string> 
  purchase_amount?: Array<string> 
}

interface RequestFormProps{
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  handleInputDate: (date: string) => void, 
  handleDropdown: (label: string, category: string) => void, 
  handleSubmit: () => void, 
  handleCancel: () => void, 
  date: string,
  category: string | null
  errors: RequestErrors | null
}

function handleAccordion(){
  console.log("test")
}

function RequestForm({
  handleInput, 
  handleInputDate, 
  handleDropdown, 
  handleSubmit,
  handleCancel,
  date, 
  category, 
  errors
}:RequestFormProps) {

   const setListItem = (label: string, name: string, type:TextFieldType = "text", errors:Array<String> = [] ) => {
    return {
        title: <FormControlLabel  mr={3} htmlFor={name}>{label}<RequiredIcon ml={0.5}/></FormControlLabel>,
        value: 
           <Stack gap={0}>
            <TextField name={name} width="large" type={type} required onChange={handleInput} error={ errors.length > 0 ? true : false }/>
            {errors ? errors.map((msg) =><Message error><Text size={0.75}>{msg}</Text></Message>): <></>}
          </Stack>
       
      }
   }

   let contents = [
    {
      id: "testid3434", 
      label: "Requestor's Information", 
      content:  
      <AccordionPanel 
      title={<SectionTitle ml={1}>Requestor's Information</SectionTitle>} 
      onClick={handleAccordion} 
      open={true}>
        
        <DescriptionList headCellMinWidth={20} listContents={[
          setListItem("Name", "name"),
          setListItem("Email", "email"), 
          {
            title: <FormControlLabel htmlFor="department" id="department" mr={3}>Department <RequiredIcon/></FormControlLabel>,
            value: 
            <FormControlGroup >
              <Stack gap={0}>
                <RadioButton name="department" value="technical">Technical</RadioButton>
                <RadioButton name="department" value="hr_admin">HR and Admin</RadioButton>
                <RadioButton name="department" value="accounting">Accounting</RadioButton>
              </Stack>
          </FormControlGroup>
          }, 
          {
            title: "", 
            value: <></>
          } 
        ]}/>
      </AccordionPanel>
    }, 
    {
      id: "testido99", 
      label: "Vendor Information", 
      content:   
      <AccordionPanel 
      title={<SectionTitle ml={1}>Vendor Information</SectionTitle>} 
      onClick={handleAccordion} 
      open={true}>
  
        <DescriptionList  headCellMinWidth={20} listContents={[
          setListItem("Vendor Name", "vendor_name", "text", errors?.vendor_name),
          setListItem("Tax Identification Number (TIN)", "vendor_tin", "text", errors?.vendor_name), 
          setListItem("Address", "vendor_address", "text", errors?.vendor_address), 
          setListItem("Email Address", "vendor_email", "email", errors?.vendor_email), 
          setListItem("Contact No.", "vendor_contact_num", "text", errors?.vendor_contact_num), 
          {
          title: <FormControlLabel htmlFor="vendor_certificate_of_reg" id="vendor_certificate_of_reg" mr={3}>Certificate of Registration <RequiredIcon ml={0.5}/></FormControlLabel>,
          value: 
          <FormControlGroup >
            <Stack gap={0}>
              <RadioButton name="vendor_certificate_of_reg" value="applicable" onChange={handleInput}  >Applicable</RadioButton>
              <RadioButton name="vendor_certificate_of_reg" value="n_applicable" onChange={handleInput}>Not Applicable</RadioButton>
              {errors?.vendor_certificate_of_reg ? errors.vendor_certificate_of_reg.map((msg) =><Message error><Text size={0.75}>{msg}</Text></Message>): <></>}
            </Stack>
        </FormControlGroup>
        }, 
        setListItem("Attachment", "vendor_attachment", "number", errors?.vendor_attachment), 
          
         
        ]}/>
      </AccordionPanel>
    },
    {
      id: "testid676767", 
      label: "Payment Instruction", 
      content: 
      <AccordionPanel 
      title={<SectionTitle ml={1}>Payment Instruction</SectionTitle>} 
      onClick={handleAccordion} 
      open={true}>

        <DescriptionList  headCellMinWidth={20} listContents={[
          {
            title:  <FormControlLabel htmlFor="payment_date">Payment Due Date<RequiredIcon ml={0.5}/></FormControlLabel>,
            value: <DateInput onChange={handleInputDate} value={date}/>
          },
          setListItem("Make Payable To", "payment_payable_to", "text", errors?.payment_payable_to),
          {
            title: <FormControlLabel htmlFor="payment_mode" id="payment_mode" mr={3}>Payment Mode <RequiredIcon ml={0.5}/></FormControlLabel>,
            value: 
            <FormControlGroup >
              <Stack gap={0}>
                <RadioButton name="payment_mode" value="bank_transfer" onChange={handleInput}>Bank Transfer</RadioButton>
                <RadioButton name="payment_mode" value="credit_card"  onChange={handleInput}>Credit Card</RadioButton>
                <RadioButton name="payment_mode" value="check"  onChange={handleInput}>Check</RadioButton>
                {errors?.payment_mode ? errors.payment_mode.map((msg) =><Message error><Text size={0.75}>{msg}</Text></Message>): <></>}
              </Stack>
          </FormControlGroup>
          }, 
          {
            title: "", 
            value: <></>
          } 

          
          
         
        ]}/>
      </AccordionPanel>
    },
    {
      id: "testid44", 
      label: "Purchase Description", 
      content: 
      <AccordionPanel 
      title={<SectionTitle ml={1}>Payment Description</SectionTitle>} 
      onClick={handleAccordion} 
      open={true}>

        <DescriptionList headCellMinWidth={20} listContents={[
          {
            title:  <FormControlLabel htmlFor="category">Category<RequiredIcon ml={0.5}/></FormControlLabel>,
            value: 
            <>
            <DropdownButton buttonLabel= {category ? category: "Category"}
            dropdownContents={[
              {
                type: 'selectable',
                text: 'Company Events and Activities',
                onClick:() => {handleDropdown("Company Events and Activities", "company_events")}
              },
              {
                type: 'selectable',
                text: 'Office Events and Activities',
                onClick: () => {handleDropdown("Office Events and Activities", "office_events")}
              },
              {
                type: 'selectable',
                text: 'Trainings and Seminars',
                onClick: () => {handleDropdown("Trainings and Seminars", "trainings")}
              },
              {
                type: 'selectable',
                text: 'Others',
                onClick:  () => {handleDropdown("Others", "others")}
              },
            ]
            }/>
          {errors?.purchase_category ? errors.purchase_category.map((msg) =><Message error><Text size={0.75}>{msg}</Text></Message>): <></>}
          </>
          },
          setListItem("Description", "purchase_description", "text", errors?.purchase_description),
          setListItem("Amount", "purchase_amount", "number", errors?.purchase_amount),
          // setListItem("Supporting Documents")
          {
            title: "", 
            value: <></>
          } 
        ]}/>
      </AccordionPanel>
    },

   ]
    return (
      <>
        <WithTOC contents={contents}/>
        <div id="cardbase-btm">
          <CardBase paddingSize="large">
            <ButtonGroup align="left" ml={3}>
                <Button appearance="primary" ml={3} onClick={handleSubmit}>Submit</Button>
                <Button appearance="secondary" onClick={handleCancel}>Cancel</Button>
            </ButtonGroup>
          </CardBase>
        </div>
      </>
    );
  }

function RequestFormContainer() {
  const { user } = useAuthContext()

  const [formInput, setFormInput] = useState<Request>({
    vendor_name: null,
    vendor_address: null,
    vendor_tin: null,
    vendor_email: null,
    vendor_contact_num: null,
    vendor_certificate_of_reg: null,
    vendor_attachment: null,
    payment_due_date: null,
    payment_payable_to: null,
    payment_mode: null,
    purchase_category: null,
    purchase_description: null,
    purchase_amount: null
  })
  const [date, setDate] = useState<string>(new Date().toDateString())
  const [category, setCategory] = useState<string|null>(null)
  const [errors, setErrors] = useState<RequestErrors|null>(null)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput((prevInputs) => ({
      ...prevInputs, [e.target.name]: e.target.value
    }))
    console.log(formInput); 
  }

  const handleInputDate = (date: string) => {
    setDate(date)

    setFormInput((prevInputs) => ({
      ...prevInputs, payment_due_date: date
    }))
  }

  const handleDropdown = (label: string, category: string) => {
    setCategory(label)
    setFormInput((prevInputs) => ({
      ...prevInputs, purchase_category: category
    }))
    console.log(formInput); 
  }

  const handleSubmit = () => {
    console.log(formInput); 
    if(user) createRequest(formInput); 
  }


  const handleErrors = (errors: RequestErrors) => {
    setErrors(errors); 
  }

  const navigate = useNavigate(); 

  const handleCancel = () => {
    navigate('/')
  }


  const redirectSuccess = () => {
    navigate('/', {
      state: {
        hasNewRequest: true
      }
    })
  }

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

    if (response.ok){
      redirectSuccess()
    } else {
      handleErrors(result.errors)
    }

   } catch(error) {
      console.log(error);
    }
  }


    return (
      <>
        {errors == null ? <></>
         : 
         <FloatingMessageBlock error>
            <Text>There was an issue with your submission. Please check the highlighted fields and try again.</Text>
          </FloatingMessageBlock>}

        <RequestForm  
        handleInput={handleInput} 
        date={date} 
        handleInputDate={handleInputDate}
        category={category}
        handleDropdown={handleDropdown}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        errors={errors}
        />
   
      </>
      
    );
  }


export default RequestFormContainer