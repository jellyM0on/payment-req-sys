import { IoMdHome } from "react-icons/io";
import { MdPostAdd } from "react-icons/md";
import { MdOutlinePieChart } from "react-icons/md";
import { IoIosStats } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";

import { GlobalNavi } from "@freee_jp/vibes";

import { useLocation } from "react-router";

interface NavTabsProps {
  role: string;
}

function NavTabs({ role }: NavTabsProps) {
  // const [currentPage, setCurrentPage] = useState(window.location.href)

  const location = useLocation();

  const employeeNavLinks = [
    {
      title: role == "employee" ? "My Requests" : "Home",
      url: "/",
      IconComponent: IoMdHome,
      current:
        location.pathname == "/" || location.pathname.match(/^\/requests\.*/)
          ? true
          : false,
    },
    {
      title: "Create Request",
      url: "/request/new",
      IconComponent: MdPostAdd,
      current: location.pathname == "/request/new" ? true : false,
    },
  ];

  const managerNavLinks = employeeNavLinks.concat([
    {
      title: "Summary",
      url: "#",
      IconComponent: MdOutlinePieChart,
      current: location.pathname == "/summary" ? true : false,
    },
    {
      title: "Reports",
      url: "#",
      IconComponent: IoIosStats,
      current: location.pathname == "/reports" ? true : false,
    },
  ]);

  const adminNavLinks = managerNavLinks.concat([
    {
      title: "Summary",
      url: "#",
      IconComponent: MdOutlinePieChart,
      current: location.pathname == "/summary" ? true : false,
    },
    {
      title: "Reports",
      url: "#",
      IconComponent: IoIosStats,
      current: location.pathname == "/reports" ? true : false,
    },
    {
      title: "Settings",
      url: "/settings",
      IconComponent: IoMdSettings,
      current: location.pathname.match(/^\/settings\.*/) ? true : false,
    },
  ]);

  let navLinks;

  if (role == "employee") navLinks = employeeNavLinks;
  if (role == "manager") navLinks = managerNavLinks;
  if (role == "admin") navLinks = adminNavLinks;

  return <GlobalNavi hideHelpForm links={navLinks} />;
}

export default NavTabs;
