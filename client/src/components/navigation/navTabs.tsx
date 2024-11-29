import { IoMdHome } from "react-icons/io";
import { MdPostAdd } from "react-icons/md";
import { MdOutlinePieChart } from "react-icons/md";
import { IoIosStats } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";


import { GlobalNavi } from "@freee_jp/vibes"

interface NavTabsProps {
  role: string; 
}

const employeeNavLinks = [
  {title: "Home",
    url: "/", 
    IconComponent: IoMdHome,
    current: true,
  }, 
  {title: "Create Request",
    url: "/request", 
    IconComponent: MdPostAdd,
   },
]

const adminNavLinks = employeeNavLinks.concat([
  {title: "Summary",
    url: "#", 
    IconComponent: MdOutlinePieChart,
   },
   {title: "Reports",
    url: "#", 
    IconComponent: IoIosStats,
   },
   {title: "Settings",
    url: "#", 
    IconComponent: IoMdSettings,
   },
])

function NavTabs({ role }: NavTabsProps){

  const navLinks = role === "Employee" ? employeeNavLinks : adminNavLinks;
    return(
       <GlobalNavi hideHelpForm links = { navLinks }/>
    )
}

export default NavTabs