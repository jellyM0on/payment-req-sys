import likhaLogo from "../../assets/logo-likha.png"
import user from "../../assets/placeholders/user.svg"
import { MdLogout } from "react-icons/md";
import { Header, Paragraph, Button } from "@freee_jp/vibes"
import { useAuthContext } from "../../providers/authProvider";

interface NavHeaderProps {
  name: string; 
}

function NavHeader({ name }: NavHeaderProps){
  const { logout } = useAuthContext(); 

  const handleLogout = () => {
    logout(); 
  }

  return(
      <Header logo={<img src={likhaLogo} width="200px" height="25px"></img>}
        sectionNode={
          <div className='nav-header'>
              <Paragraph>Welcome, { name }!</Paragraph>
              <img src={user} alt="" width="32px" height="32px"/>
              <Button appearance="tertiary" IconComponent={MdLogout} onClick={handleLogout}></Button>
          </div>
        }
      />
       
    )
}

export default NavHeader

