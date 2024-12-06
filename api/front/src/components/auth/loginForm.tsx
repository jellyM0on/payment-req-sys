import { CardBase, 
  DescriptionList, 
  TextField, 
  PageTitle, 
  Button,
  InlineLink, 
  FormControlLabel, 
  Text, 
  Stack,
  ContentsBase,
  MarginBase
} from "@freee_jp/vibes"
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
      <CardBase paddingSize="zero" overflowHidden={false}> 
            <MarginBase mt={2} mb={2}>
   
            <PageTitle mb={2} ml={1.5}>Log in</PageTitle>

            {/* to change */}
            <p id="error-msg"></p>

            <DescriptionList 
              listContents={[ 
                {
                  title: <FormControlLabel  htmlFor="email">Email</FormControlLabel>,
                  value: <TextField id="email" width="large" type="email" required={true} onChange={handleInput}/>
                }, 
                {
                  title: <FormControlLabel htmlFor="password">Password</FormControlLabel>,
                  value: <TextField id="password" width="large" type="password" required={true} onChange={handleInput} error={false}/>
                }, 
              ]}
            />


          <Stack direction="vertical" alignItems="center" mt={1.5}>
              <Button onClick={handleSubmit} appearance="primary" width="default">Log in</Button>
              <Text>Don't have an account yet? <InlineLink href="./signup">Sign up</InlineLink></Text>
           </Stack>

                      
           </MarginBase>

      </CardBase>
    )
}

export default LoginForm;