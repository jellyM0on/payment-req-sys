import { CardBase, DescriptionList, TextField, PageTitle, 
  Button, InlineLink, FormControlLabel} from "@freee_jp/vibes"

async function login(){
  // const nameInput = document.getElementById('name') as HTMLInputElement; 
  const emailInput = document.getElementById('email') as HTMLInputElement; 
  const passwordInput = document.getElementById('password') as HTMLInputElement; 

  const loginData:object = {

    email: emailInput.value, 
    password: passwordInput.value

  }

  console.log(loginData)

  postData("http://localhost:3000/users/sign_in", loginData)

}

const postData = async(url: string, data: object) => {
  try{
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify(data)
    }); 

    const result = await response.json()
    return result
  } catch (error){
    console.log(error);
  }
}


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
              <Button onClick={login} appearance="primary" width="full">Log in</Button>
              <p>Don't have an account yet? <InlineLink href="./signup">Sign up</InlineLink></p>
            </div>

            </div>
           
          </CardBase>
      </div>
  
    )
}

export default LoginForm;