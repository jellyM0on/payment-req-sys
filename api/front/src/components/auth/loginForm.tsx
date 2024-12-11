import { CardBase, 
  DescriptionList, 
  TextField, 
  PageTitle, 
  Button,
  InlineLink, 
  FormControlLabel, 
  Text, 
  Stack,
  MarginBase, 
  Message
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
    const [errors, setErrors] = useState<string| undefined>()

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {

      setFormInput((prevInputs) => ({
        ...prevInputs, [e.target.id]: e.target.value
      }))
      console.log(formInput); 
    }

    const handleSubmit = async () => {
      const response = await login(formInput);

      if (response.error){
        setErrors(response.error)
      }

    }

    return(
      <CardBase paddingSize="zero" overflowHidden={false}> 
            <MarginBase mt={2} mb={2}>
   
            <PageTitle mb={2} ml={1.5}>Log in</PageTitle>
            {errors ? <Message error mb={2} ml={1.5}><Text color="alert">{errors}</Text></Message> :<></>}
          
          <div id="auth-form">
            <DescriptionList 
              listContents={[ 
                {
                  title: <FormControlLabel  htmlFor="email">Email</FormControlLabel>,
                  value: <TextField id="email" width="large" type="email" required={true} onChange={handleInput} error={errors ? true : false}/>
                }, 
                {
                  title: <FormControlLabel htmlFor="password">Password</FormControlLabel>,
                  value: <TextField id="password" width="large" type="password" required={true} onChange={handleInput} error={errors ? true : false}/>
                }, 
              ]}
            />
          </div>


          <Stack direction="vertical" alignItems="center" mt={1.5}>
              <Button onClick={handleSubmit} appearance="primary" width="default">Log in</Button>
              {/* <Text>Don't have an account yet? <InlineLink href="./signup">Sign up</InlineLink></Text> */}
           </Stack>

                      
           </MarginBase>

      </CardBase>
    )
}

export default LoginForm;