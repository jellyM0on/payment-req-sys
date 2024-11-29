import { CardBase, DescriptionList, TextField, PageTitle, 
  Button, InlineLink, FormControlLabel} from "@freee_jp/vibes"

function LoginForm(){
    return(
      <div className='login-form'>
          <CardBase paddingSize="zero">
            <div className='center-content'>
              <div className='left-content'>
                <PageTitle>Log in</PageTitle>
                <DescriptionList 
                  listContents={[ 
                    {
                      title: <FormControlLabel htmlFor="login-name" mr={3}>Name</FormControlLabel>,
                      value: <TextField id="login-name" width="full" required />
                    }, 
                    {
                      title: <FormControlLabel htmlFor="login-email">Email</FormControlLabel>,
                      value: <TextField id="login-email" width="full" required/>
                    }, 
                    {
                      title: <FormControlLabel htmlFor="login-password">Password</FormControlLabel>,
                      value: <TextField id="login-password" width="full" required/>
                    }, 
                  ]}
                  spacing="normal" />
              </div>
            <div className="center-content-fit auth-btn">
              <Button appearance="primary" width="full">Log in</Button>
              <p>Don't have an account yet? <InlineLink href="./signup">Sign up</InlineLink></p>
            </div>

            </div>
           
          </CardBase>
      </div>
  
    )
}

export default LoginForm;