import likhaLogo from "../../assets/logo-likha.png"
import user from "../../assets/placeholders/user.svg"
import { MdLogout } from "react-icons/md";
import { Header, Paragraph, Button } from "@freee_jp/vibes"

interface NavHeaderProps {
  name: string; 
}

function NavHeader({ name }: NavHeaderProps){
    return(
        <Header logo={<img src={likhaLogo} width="200px" height="25px"></img>}
         sectionNode={
           <div className='nav-header'>
                <Paragraph>Welcome, { name }!</Paragraph>
                <img src={user} alt="" width="32px" height="32px"/>
                <Button appearance="tertiary" IconComponent={MdLogout}></Button>
           </div>
         }
        />
       
    )
}

export default NavHeader

