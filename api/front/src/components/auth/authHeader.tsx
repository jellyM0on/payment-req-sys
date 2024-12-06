import likhaLogo from "../../assets/logo-likha.png"
import { PageTitle } from "@freee_jp/vibes"
import "../../App.css"
import { Stack } from "@freee_jp/vibes"

function AuthHeader(){
    return(
        <Stack direction="vertical" justifyContent="center" alignItems="center" gap={0.5} ma={3}>
            <img src={likhaLogo} alt="Likha-IT by Freee Logo" width="356px" height="42px"/>
            <PageTitle textAlign="center" inline={false}>Payment Request Portal</PageTitle>
        </Stack>
    )
}

export default AuthHeader;