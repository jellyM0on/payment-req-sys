import { CardBase, DescriptionList, TextField, PageTitle, 
  Button, InlineLink, FormControlLabel} from "@freee_jp/vibes"
import { useNavigate } from "react-router";
import { useEffect } from "react";

import { useAuthContext } from "../../providers/authProvider";


function LoginForm(){
    const { login } = useAuthContext(); 

    const handleSubmit = () => {
      const emailInput = document.getElementById('email') as HTMLInputElement; 
      const passwordInput = document.getElementById('password') as HTMLInputElement; 
      const loginData = {
          email: emailInput.value, 
          password: passwordInput.value
      }
  
      login(loginData)
    }

    return(
      <div className='login-form'>
          <CardBase paddingSize="zero">
            <div className='center-content'>
              <div className='left-content'>
                <PageTitle>Log in</PageTitle>
                <DescriptionList 
                  listContents={[ 
                    {
                      title: <FormControlLabel htmlFor="name" mr={3}>Name</FormControlLabel>,
                      value: <TextField id="name" width="full" type="text" required />
                    }, 
                    {
                      title: <FormControlLabel htmlFor="email">Email</FormControlLabel>,
                      value: <TextField id="email" width="full"  type="email" required/>
                    }, 
                    {
                      title: <FormControlLabel htmlFor="password">Password</FormControlLabel>,
                      value: <TextField id="password" width="full" type="password" required/>
                    }, 
                  ]}
                  spacing="normal" />
              </div>
            <div className="center-content-fit auth-btn">
              <Button onClick={handleSubmit} appearance="primary" width="full">Log in</Button>
              <p>Don't have an account yet? <InlineLink href="./signup">Sign up</InlineLink></p>
            </div>

            </div>
           
          </CardBase>
      </div>
  
    )
}

export default LoginForm;