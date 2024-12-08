import { CardBase, DescriptionList, TextField, PageTitle, 
  Button, FormControlLabel,
  RequiredIcon,
  RadioButton,
  FormControlGroup, 
  DropdownButton, 
  ApiComboBox,
  SingleComboBoxOption,
  useApiComboBox, 
  Stack, 
  MarginBase, 
  Text,
} from "@freee_jp/vibes"
  
import { useState } from "react"


interface UserSignup{
  name: string | null, 
  email: string | null, 
  password: string | null, 
  password_confirmation: string | null, 
  position: string | null, 
  department: string | null, 
  manager_id: number | null | string,
  role: string | null

}

function SignupForm(){

    const [role, setRole] = useState("Choose a role")
    const [manager, setManager] = useState<SingleComboBoxOption>();
    const [formInput, setFormInput] = useState<UserSignup>({
      name: null, 
      email: null, 
      password: null, 
      password_confirmation: null, 
      position: null, 
      department: null, 
      manager_id: null, 
      role: null
    }); 

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormInput((prevInputs) => ({
        ...prevInputs, [e.target.name]: e.target.value
      }))
      console.log(formInput); 
    }

    const getManagers = async () => {
      try{
        const response = await fetch("http://localhost:3000/users/managers", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }, 
        credentials: 'include'
      }); 

    
      console.log("test")

      const result = await response.json()
    
      return {
        items: result.managers, 
        meta: result.pagination_meta
      }

      } catch(error) {
        console.log(error);
      }
    }

    const handleDropdown = (e: React.MouseEvent<HTMLInputElement>) => {
      const target = e.target as HTMLElement
      console.log(target); 
      const selectedItem = target.querySelector('span')!.textContent;
      setRole(selectedItem!)
      setFormInput((prevInputs) => ({
        ...prevInputs, role: selectedItem!.toLowerCase()
      }))
      console.log(formInput); 
    }

    interface Manager{
      id: number, 
      name: string
    }

    const managers = useApiComboBox<Manager>({
      fetchItems: getManagers, 
      createOptions: (managers: Manager[]) => managers?.map(({id, name}): SingleComboBoxOption => ({
        id, 
        label: name 
      }))
    }) 

    const handleSubmit = () => {
      setFormInput((prevInputs) => ({
        ...prevInputs, manager_id: manager!.id
      }))
      console.log(manager!.id)
      console.log(formInput)
      registerAccount(formInput)
    }

    const registerAccount = async(userData:UserSignup) => {
      try{
        const response = await fetch("http://localhost:3000/users", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(userData),
            credentials: 'include'
        }); 
    
        const result = await response.json()

        return(result);

      
    } catch (error){
        console.log(error);
        return { error: "Error occured"}
    }
    }


      return(
            <CardBase paddingSize="zero" overflowHidden={false}>
                <MarginBase mt={2} mb={2}>
                  <PageTitle mb={2} ml={1.5}>Sign up</PageTitle>
                  <DescriptionList 
                    listContents={[ 
                      {
                        title: <FormControlLabel htmlFor="name" mr={3}>Name <RequiredIcon/> </FormControlLabel>,
                        value: <TextField name="name" width="large" required onChange={handleInput}/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="email" mr={3}>Email <RequiredIcon/></FormControlLabel>,
                        value: <TextField name="email" width="large" required onChange={handleInput}/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="password" mr={3}>Password <RequiredIcon/></FormControlLabel>,
                        value: 
                          <Stack gap={0.5}>
                                 <TextField name="password" width="large" required onChange={handleInput}/>
                                 <Text>Password must be at least 8 characters long</Text>
                          </Stack>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="password_confirmation" mr={3}>Confirm Password <RequiredIcon/></FormControlLabel>,
                        value: <TextField name="password_confirmation" width="large" required onChange={handleInput}/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="position" mr={3}>Position <RequiredIcon/></FormControlLabel>,
                        value: <TextField name="position" width="large" required onChange={handleInput}/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="department" id="department" mr={3}>Department <RequiredIcon/></FormControlLabel>,
                        value: 
                        <FormControlGroup >
                          <Stack gap={0.5}>
                            <RadioButton name="department" value="technical" onChange={handleInput}>Technical</RadioButton>
                            <RadioButton name="department" value="hr_admin" onChange={handleInput}>HR and Admin</RadioButton>
                            <RadioButton name="department" value="accounting" onChange={handleInput}>Accounting</RadioButton>
                          </Stack>
                        
                       
                      </FormControlGroup>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="manager" mr={3}>Manager <RequiredIcon/></FormControlLabel>,
                        value: <ApiComboBox value={manager} onChange={opt => { setManager(opt)}} {...managers}/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="role">Role <RequiredIcon/></FormControlLabel>,
                        value: <DropdownButton buttonLabel={role} dropdownContents={[
                          {
                            type: 'selectable',
                            text: 'Employee',
                            onClick: handleDropdown
                      
                          },
                          {
                            type: 'selectable',
                            text: 'Manager',
                            onClick: handleDropdown
                          },
                          {
                            type: 'selectable',
                            text: 'Admin',
                            onClick: handleDropdown
                          }
                        ]}/>
                      },
                    ]}
                    spacing="normal" 
                  />
               
              <Stack direction="vertical" alignItems="center" mt={1.5} mr={3} ml={3}>
                <Button onClick={handleSubmit} appearance="primary" width="default" >Create account</Button>
               </Stack>
               </MarginBase>
            </CardBase>
    
      )
  }
  
  export default SignupForm;