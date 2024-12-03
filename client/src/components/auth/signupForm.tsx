import { CardBase, DescriptionList, TextField, PageTitle, 
    Button, FormControlLabel,
    RequiredIcon,
    RadioButton,
    FormControlGroup, 
    DropdownButton, 
    ApiComboBox,
    SingleComboBoxOption,
    useApiComboBox
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
        <div className='login-form'>
            <CardBase paddingSize="zero">
              <div className='center-content'>
                <div className='left-content'>
                  <PageTitle>Sign up</PageTitle>
                  <DescriptionList 
                    listContents={[ 
                      {
                        title: <FormControlLabel htmlFor="name" mr={3}>Name <RequiredIcon/> </FormControlLabel>,
                        value: <TextField id="name" width="full" required />
                      }, 
                      {
                        title: <FormControlLabel htmlFor="email">Email <RequiredIcon/></FormControlLabel>,
                        value: <TextField id="email" width="full" required/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="password">Password <RequiredIcon/></FormControlLabel>,
                        value: 
                          <div> 
                            <TextField id="password" width="full" required/>
                            <p className="mt-1">Password must be at least 8 characters long.</p>
                          </div>
             
                      }, 
                      {
                        title: <FormControlLabel htmlFor="password">Confirm Password <RequiredIcon/></FormControlLabel>,
                        value: <TextField id="password" width="full" required/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="position">Position <RequiredIcon/></FormControlLabel>,
                        value: <TextField id="position" width="full" required/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="department">Department <RequiredIcon/></FormControlLabel>,
                        value: 
                    
                        <FormControlGroup>
                          <div className="flex flex-col">
                          <RadioButton name="department" value="technical">Technical</RadioButton>
                          <RadioButton name="department" value="hr_admin">HR and Admin</RadioButton>
                          <RadioButton name="department" value="accounting">Accounting</RadioButton>
                          </div>
                       
                      </FormControlGroup>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="login-password">Manager <RequiredIcon/></FormControlLabel>,
                        // value: <div>test</div>
                        // add options 
                        // value: <ApiComboBox fetchItems={getManagers} isLoading={false} meta={testMeta}/>
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
                    spacing="normal" />
                </div>
              <div className="center-content-fit auth-btn">
                <Button appearance="primary" width="full">Create account</Button>
              </div>
  
              </div>
             
            </CardBase>
        </div>
    
      )
  }
  
  export default SignupForm;