import NavHeader from "./navHeader";
import NavTabs from "./navTabs";

interface NavBarProps {
  name: string;
  role: string;
}

function NavBar({ name, role }: NavBarProps) {
  return (
    <div id="navbar">
      <NavHeader name={name} />
      <NavTabs role={role} />
    </div>
  );
}

export default NavBar;
