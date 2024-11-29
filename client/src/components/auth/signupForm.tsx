import { CardBase, DescriptionList, TextField, PageTitle, 
    Button, FormControlLabel} from "@freee_jp/vibes"
  
  function SignupForm(){
      return(
        <div className='login-form'>
            <CardBase paddingSize="zero">
              <div className='center-content'>
                <div className='left-content'>
                  <PageTitle>Sign up</PageTitle>
                  <DescriptionList 
                    listContents={[ 
                      {
                        title: <FormControlLabel htmlFor="name" mr={3}>Name</FormControlLabel>,
                        value: <TextField id="name" width="full" required />
                      }, 
                      {
                        title: <FormControlLabel htmlFor="email">Email</FormControlLabel>,
                        value: <TextField id="email" width="full" required/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="password">Password</FormControlLabel>,
                        value: <TextField id="password" width="full" required/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="password">Confirm Password</FormControlLabel>,
                        value: <TextField id="password" width="full" required/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="position">Position</FormControlLabel>,
                        value: <TextField id="position" width="full" required/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="login-password">Department</FormControlLabel>,
                        value: <TextField id="login-password" width="full" required/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="login-password">Manager</FormControlLabel>,
                        value: <TextField id="login-password" width="full" required/>
                      }, 
                      {
                        title: <FormControlLabel htmlFor="login-password">Role</FormControlLabel>,
                        value: <TextField id="login-password" width="full" required/>
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