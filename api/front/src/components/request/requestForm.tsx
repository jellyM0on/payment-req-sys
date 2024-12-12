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
  FloatingMessageBlock,
  DropdownContent
 } from "@freee_jp/vibes";

import { RequiredIcon } from "@freee_jp/vibes";
import { useState, useEffect, HtmlHTMLAttributes } from "react";
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

interface RequestObj{
  id: number,
  user_id: number,
  overall_status: string,
  current_stage: string,
  vendor_name: string,
  vendor_tin: string,
  vendor_address: string,
  vendor_email: string,
  vendor_contact_num: string,
  vendor_certificate_of_reg: string 
  vendor_attachment: number 
  payment_due_date: string 
  payment_payable_to: string  
  payment_mode: string 
  purchase_category: string  
  purchase_description: string 
  purchase_amount: number  
  errors: RequestErrors
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
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  handleChangeDate: (date: string) => void, 
  handleChangeDropdown: (category: string) => void, 
  handleSubmit: () => void, 
  handleCancel: () => void, 
  category: string | null
  errors: RequestErrors | null, 
  formInput : Request | null | undefined
  existingRequest: Request | undefined
}

function handleAccordion(){
  console.log("test")
}

// normal list item 
interface TextFormInput {
  label: string
  name: string
  type: TextFieldType
  errors?: Array<string>
  formValue?: string | null
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const setListItem = ({label, name, type, errors, formValue, disabled, handleChange}: TextFormInput) => {
  return {
      title: <FormControlLabel  mr={3} id={name} >{label}<RequiredIcon ml={0.5}/></FormControlLabel>,
      value: 
         <Stack gap={0}>
          <TextField 
            name={name} type={type} onChange={handleChange} disabled={disabled}
            value={formValue ? formValue : ""} 
            error={ errors ? true : false }
            width="large" required />
          {errors ? errors.map((msg) =><Message error><Text size={0.75}>{msg}</Text></Message>): <></>}
        </Stack>
    }
 }

 // radio buttons 
 interface RadioContainerProps {
  options: { name: string, value: string, label: string, checked?: boolean}[]
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  formValue?:string
 }

 const RadioContainer = ({options, handleChange, disabled, formValue}: RadioContainerProps) => {

  const [selectedOpt, setSelectedOpt] = useState(formValue != "null" ? formValue : options[0].value )

  return(
    <FormControlGroup >
      <Stack gap={0}>
        {options.map((option, i) => (
          <RadioButton name={option.name} disabled={disabled} value={option.value} key={i}
          checked={selectedOpt == option.value ? true : false} 
          onChange={(e :React.ChangeEvent<HTMLInputElement>) => { 
            if(disabled) return 
            setSelectedOpt(option.value)
            handleChange(e) 
          }}>
            {option.label}
          </RadioButton>
        ))}
     </Stack>
  </FormControlGroup>
  )
 }

 interface RadioFormInput {
  options: { name: string, value: string, label: string, checked?: boolean }[]
  label: string
  id: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  formValue?:string
}

 const setRadioItem = ({options, label, id, disabled, formValue, handleChange}: RadioFormInput) => {
  return {
    title: <FormControlLabel id={id}  mr={3}>{label}<RequiredIcon/></FormControlLabel>,
    value: <RadioContainer options={options} handleChange={handleChange} disabled={disabled} formValue={formValue}/>
  }
 }

 // form date input 
 interface DateFormInputProps{
  handleChange: (date: string) => void
  formValue: string | null | undefined
 }

 const DateFormInput = ({handleChange, formValue}: DateFormInputProps) => {
  const [date, setDate] = useState(new Date().toString())

  useEffect(() => {
    if(formValue){
      setDate(formValue)
    }
  }, [formValue])

  return(
    <DateInput 
    onChange={() => {
      setDate(date)
      console.log(date)
      handleChange(date)
    }}
    value={date}/>
  )
 }

interface DateFormInput{
  handleChange: (date: string) => void
  id: string
  label: string
  formValue?: string | null
}

 const setDateItem = ({handleChange, id, label, formValue}: DateFormInput) => {
 
  return{
    title: <FormControlLabel id={id}>{label}<RequiredIcon ml={0.5}/></FormControlLabel>,
    value: <DateFormInput handleChange= {handleChange} formValue={formValue}/>
  }
 }

 // dropdown 

 interface DropdownInputProps{
  options: {text:string, value:string}[], 
  formValue: string | null | undefined, 
  handleChange: (category:string) => void
 }

 const DropdownInput = ({options, formValue, handleChange}:DropdownInputProps) => {

  console.log(formValue)
  console.log(typeof(formValue) == "string")
  const [category, setCategory] = useState(options[0].text)

  useEffect(() => {
    if(formValue){
      const option = options.find(opt => opt.value == formValue)
      setCategory(option!.text)
    }
  }, [formValue])

  let contents:DropdownContent[] = []; 
  options.map(option => contents.push({
    type: 'selectable', 
    text: option.text, 
    onClick: () => {
      setCategory(option.text)
      handleChange(option.value)
    }
  }))
  return(
    <DropdownButton buttonLabel={category}
    dropdownContents = {contents}
    />
  )
 }

 interface DropdownFormInput{
  options: {text:string, value:string}[], 
  formValue?: string | null, 
  label: string, 
  id: string
  handleChange: (category:string) => void
 }
 

const setDropdownItem = ({options, formValue, label, id, handleChange}: DropdownFormInput ) => {
  return{
    title: <FormControlLabel id={id}>{label}<RequiredIcon ml={0.5}/></FormControlLabel>,
    value: <DropdownInput options={options} formValue={formValue} handleChange={handleChange}/>
  }
}

function RequestForm({
  handleChange, 
  handleChangeDate, 
  handleChangeDropdown, 
  handleSubmit,
  handleCancel,
  errors, 
  formInput
}:RequestFormProps) {

  const { user } = useAuthContext()

   let contents = [
    {
      id: "request-form-requestor", 
      label: "Requestor's Information", 
      content:  
      <AccordionPanel 
      title={<SectionTitle ml={1}>Requestor's Information</SectionTitle>} 
      onClick={handleAccordion} 
      open={true}>

        <DescriptionList headCellMinWidth={20} listContents={[
          setListItem({
            label: "Name", 
            name: "name", 
            type: "text", 
            formValue: `${user?.name}`,
            disabled: true, 
          }),
          setListItem({
            label: "Email", 
            name: "email", 
            type: "email", 
            formValue: `${user?.email}`,
            disabled: true
          }),
          setRadioItem({
            handleChange: handleChange,
            formValue: `${user?.department}`,
            disabled: true,
            label: "Department",
            id: "department",
            options: [
              { 
                name: "department",
                label: "Technical",
                value: "technical"
              }, 
              {
                name: "department",
                label: "HR and Admin",
                value: "hr_admin"
              }, 
              {
                name: "department",
                label: "Accounting",
                value: "accounting"
              }
            ]
          }),
          {
            title: "", 
            value: <></>
          } 
        ]}/>
      </AccordionPanel>
    }, 
    {
      id: "request-form-vendor-info", 
      label: "Vendor Information", 
      content:   
      <AccordionPanel 
      title={<SectionTitle ml={1}>Vendor Information</SectionTitle>} 
      onClick={handleAccordion} 
      open={true}>
  
        <DescriptionList  headCellMinWidth={20} listContents={[
            setListItem({
              label: "Vendor Name", 
              name: "vendor_name", 
              type: "text", 
              errors: errors?.vendor_name,
              formValue: formInput?.vendor_name,
              handleChange: handleChange
            }),
            setListItem({
              label: "Tax Identification Number (TIN)", 
              name: "vendor_tin", 
              type: "text", 
              errors: errors?.vendor_tin,
              formValue: formInput?.vendor_tin,
              handleChange: handleChange
            }),
            setListItem({
              label: "Address", 
              name: "vendor_address", 
              type: "text", 
              errors: errors?.vendor_address,
              formValue: formInput?.vendor_address,
              handleChange: handleChange
            }),
            setListItem({
              label: "Email Address", 
              name: "vendor_email", 
              type: "email", 
              errors: errors?.vendor_email,
              formValue: formInput?.vendor_email,
              handleChange: handleChange
            }),
            setListItem({
              label: "Contact No.", 
              name: "vendor_contact_num", 
              type: "text", 
              errors: errors?.vendor_contact_num,
              formValue: formInput?.vendor_contact_num,
              handleChange: handleChange
            }),
            setRadioItem({
              handleChange: handleChange,
              formValue: `${formInput?.vendor_certificate_of_reg}`,
              label: "Certificate of Registration",
              id: "vendor_certificate_of_reg",
              options: [
                { 
                  name: "vendor_certificate_of_reg",
                  label: "Applicable",
                  value: "applicable"
                }, 
                {
                  name: "vendor_certificate_of_reg",
                  label: "Not Applicable",
                  value: "n_applicable"
                }
              ]
            }),
            {
              title: "", 
              value: <></>
            } 
        ]}/>
      </AccordionPanel>
    },
    {
      id: "request-form-payment-instruc", 
      label: "Payment Instruction", 
      content: 
      <AccordionPanel 
      title={<SectionTitle ml={1}>Payment Instruction</SectionTitle>} 
      onClick={handleAccordion} 
      open={true}>

        <DescriptionList  headCellMinWidth={20} listContents={[
          setDateItem({
            id: "payment_due_date", 
            label: "Payment Due Date", 
            handleChange: handleChangeDate, 
            formValue: formInput?.payment_due_date
          }),
          setListItem({
            label: "Make Payable To", 
            name: "payment_payable_to", 
            type: "text", 
            errors: errors?.payment_payable_to,
            formValue: formInput?.payment_payable_to, 
            handleChange: handleChange
          }),
          setRadioItem({
            handleChange: handleChange, 
            formValue: `${formInput?.payment_mode}`,
            label: "Payment Mode",
            id: "payment_mode", 
            options: [
              {
                name: "payment_mode", 
                label: "Bank Transfer", 
                value: "bank_transfer"
              }, 
              {
                name: "payment_mode", 
                label: "Credit Card", 
                value: "credit_card"
              }, 
              {
                name: "payment_mode", 
                label: "Check", 
                value: "check"
              }

            ]
          }), 
          {
            title: "", 
            value: <></>
          } 
        ]}/>
      </AccordionPanel>
    },
    {
      id: "request-form-purchase-descrip", 
      label: "Purchase Description", 
      content: 
      <AccordionPanel 
      title={<SectionTitle ml={1}>Payment Description</SectionTitle>} 
      onClick={handleAccordion} 
      open={true}>

        <DescriptionList headCellMinWidth={20} listContents={[
          setDropdownItem({
            id: "category", 
            label: "Category", 
            formValue: formInput?.purchase_category, 
            handleChange: handleChangeDropdown,
            options: [
              {
                text: "Company Events and Activities", 
                value: "company_events"
              }, 
              {
                text: "Office Events and Activities", 
                value: "office_events"
              }, 
              {
                text: "Trainings and Seminars", 
                value: "trainings"
              }, 
              {
                text: "Others", 
                value: "others"
              }
            ]
          }), 
          setListItem({
            label: "Description", 
            name: "purchase_description", 
            type: "text", 
            formValue: formInput?.purchase_description,
          }),
          setListItem({
            label: "Amount", 
            name: "purchase_amount", 
            type: "number", 
            formValue: (formInput?.purchase_amount)?.toString(),
          }),
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

interface RequestFormContainerProps{
  handleRequest: (requestData: Request) => Promise<any>
  existingRequest? : Request, 
  mode: string
}

function RequestFormContainer({handleRequest, existingRequest, mode}: RequestFormContainerProps) {
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

  const [category, setCategory] = useState<string|null>(null)
  const [errors, setErrors] = useState<RequestErrors|null>(null)


  useEffect(() => {
    if(existingRequest) setFormInput(existingRequest)

    console.log(existingRequest)
    console.log(formInput)
  }, [existingRequest])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("test")
    setFormInput((prevInputs) => ({
      ...prevInputs, [e.target.name]: e.target.value
    }))
    console.log(formInput); 
  }

  const handleChangeDate = (date: string|undefined) => {
    if(date){
    setFormInput((prevInputs) => ({
      ...prevInputs, payment_due_date: date
    }))
  }
  }

  const handleChangeDropdown = (category: string) => {
    setFormInput((prevInputs) => ({
      ...prevInputs, purchase_category: category
    }))
    console.log(formInput); 
  }

  const handleSubmit = async() => {
    if(!user) return 
    console.log(handleRequest)
    const result = await handleRequest(formInput)

    console.log(result); 
    console.log(typeof(result)); 

    if(result.errors){
      handleErrors(result.errors)
    }

    if(result && !result.errors){
      redirectSuccess()
    }
  }

  const handleErrors = (errors: RequestErrors) => {
    setErrors(errors); 
  }

  const navigate = useNavigate(); 

  const handleCancel = () => {
    navigate('/')
  }


  const redirectSuccess = () => {
    if(mode == "new"){
      navigate('/', {
        state: {
          hasNewRequest: true
        }
      })
    } 

    if(mode == "edit"){
      navigate('/', {
        state: {
          hasEditedRequest: true
        }
      })
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
        formInput = {formInput}
        existingRequest = {existingRequest}
        handleChange={handleChange} 
        handleChangeDate={handleChangeDate}
        category={category}
        handleChangeDropdown={handleChangeDropdown}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        errors={errors}
        />
   
      </>
      
    );
  }


export default RequestFormContainer