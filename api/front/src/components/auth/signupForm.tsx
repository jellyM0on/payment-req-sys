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
  Container, 
  MarginBase, 
  Text
} from "@freee_jp/vibes"
  
import { useEffect, useState } from "react"

  function SignupForm(){

    const [role, setRole] = useState("Choose a role")
    const [managers, setManagers] = useState({})
    // const [manager, setManager] = useState<SingleComboBoxOption>();

    const getManagers = async () => {
      try{
        const response = await fetch("http://localhost:3000/users/managers", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }, 
        credentials: 'include'
      }); 

      const result = await response.json()
      setManagers(result.managers)
      return result.managers

      } catch(error) {
        console.log(error);
      }
    }

    useEffect( () => {
      getManagers()
      console.log(managers)
    }, [])

    // getManagers()

    const handleDropdown = (e: React.MouseEvent<HTMLInputElement>) => {
      const target = e.target as HTMLElement
      console.log(target); 
      const selectedItem = target.querySelector('span')!.textContent;
      setRole(selectedItem!)
    }

    interface ManagerItem{
      name: string, 
      id: number
    }

    const testMeta= {
      limit: 1,
      currentPage: 1,
      totalPages: 1,
      totalCount: 1,
    }

    const testItem = {
      label: "test",
      id: 1
    }

      return(
            <CardBase paddingSize="zero" overflowHidden={false}>
                <MarginBase mt={2} mb={2}>
                  <PageTitle mb={2} ml={1.5}>Sign up</PageTitle>
                  <DescriptionList 
                    listContents={[ 
                      {
                        title: <FormControlLabel htmlFor="name" mr={3}>Name <RequiredIcon/> </FormControlLabel>,
                        value: <TextField id="name" width="large" required />
                      }, 
                      {
                        title: <FormControlLabel htmlFor="email" mr={3}>Email <RequiredIcon/></FormControlLabel>,
                        value: <TextField id="email" width="large" required/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="password" mr={3}>Password <RequiredIcon/></FormControlLabel>,
                        value: 
                          <Stack gap={0.5}>
                                 <TextField id="password" width="large" required/>
                                 <Text>Password must be at least 8 characters long</Text>
                          </Stack>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="password" mr={3}>Confirm Password <RequiredIcon/></FormControlLabel>,
                        value: <TextField id="password" width="large" required/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="position" mr={3}>Position <RequiredIcon/></FormControlLabel>,
                        value: <TextField id="position" width="large" required/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="department" mr={3}>Department <RequiredIcon/></FormControlLabel>,
                        value: 
                    
                        <FormControlGroup>
                          <Stack gap={0.5}>
                            <RadioButton name="department" value="technical">Technical</RadioButton>
                            <RadioButton name="department" value="hr_admin">HR and Admin</RadioButton>
                            <RadioButton name="department" value="accounting">Accounting</RadioButton>
                          </Stack>
                        
                       
                      </FormControlGroup>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="login-password" mr={3}>Manager <RequiredIcon/></FormControlLabel>,
                      }, 
                      {
                        title: <FormControlLabel htmlFor="login-password">Role <RequiredIcon/></FormControlLabel>,
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
                            text: 'Accountant',
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
                <Button appearance="primary" width="default" >Create account</Button>
               </Stack>
               </MarginBase>
            </CardBase>
    
      )
  }
  
  export default SignupForm;