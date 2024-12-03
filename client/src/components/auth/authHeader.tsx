import likhaLogo from "../../assets/logo-likha.png"
import { PageTitle } from "@freee_jp/vibes"
import "../../App.css"

function AuthHeader(){
    return(
        <div className="center-content py-8">
            <img src={likhaLogo} alt="Likha-IT by Freee Logo" width="356px" height="42px"/>
            <PageTitle textAlign="center" inline={false}><p>Payment Request Portal</p></PageTitle>
        </div>
    )
}

export default AuthHeader;