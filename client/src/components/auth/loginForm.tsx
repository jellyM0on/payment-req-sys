import { CardBase, DescriptionList, TextField, PageTitle, 
  Button, InlineLink, FormControlLabel} from "@freee_jp/vibes"
import { useAuthContext } from "../../providers/authProvider";
import { useState } from "react";


interface UserLogin{
  email: string | null, 
  password: string | null
}

function LoginForm(){
    const { login } = useAuthContext(); 
    const [formInput, setFormInput] = useState<UserLogin>({email:null, password: null}); 

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.value === ""){
        console.log(e.target)
        e.target.classList.add('vb-textField--error')
      } else {
        e.target.classList.remove('vb-textField--error')
      }

      setFormInput((prevInputs) => ({
        ...prevInputs, [e.target.id]: e.target.value
      }))
      console.log(formInput); 
    }

    const handleSubmit = async () => {
      const response = await login(formInput);

      if(response.error){
        const errorMsg = document.querySelector("#error-msg")!;
        errorMsg.textContent = response.error;
        const textFields = document.querySelectorAll(".vb-textField")!; 
        textFields.forEach((field) => {
          field.classList.add('vb-textField--error')
          console.log(field); 
        })
      }
    }

    return(
      <div className='login-form'>
          <CardBase paddingSize="zero">
            <div className='center-content'>
              <div className='left-content'>
                <PageTitle>Log in</PageTitle>
                <p id="error-msg"></p>
                <DescriptionList 
                  listContents={[ 
                    {
                      title: <FormControlLabel htmlFor="email">Email</FormControlLabel>,
                      value: <TextField id="email" width="full" type="email" required={true} onChange={handleInput}/>
                    }, 
                    {
                      title: <FormControlLabel htmlFor="password">Password</FormControlLabel>,
                      value: <TextField id="password" width="full" type="password" required={true} onChange={handleInput} error={false}/>
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