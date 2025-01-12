import likhaLogo from "../../assets/logo-likha.png";
import { MdLogout } from "react-icons/md";
import { Header, Paragraph, Button, Stack, Avatar } from "@freee_jp/vibes";
import { useAuthContext } from "../../providers/authProvider";

interface NavHeaderProps {
  name: string;
}

function NavHeader({ name }: NavHeaderProps) {
  const { logout } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <Header
      logo={<img src={likhaLogo} width="200px" height="25px"></img>}
      sectionNode={
        <Stack direction="horizontal">
          <Paragraph>Welcome, {name}!</Paragraph>
          <Avatar size="medium"></Avatar>
          <Button
            appearance="tertiary"
            IconComponent={MdLogout}
            onClick={handleLogout}
          ></Button>
        </Stack>
      }
    />
  );
}

export default NavHeader;
