import { IoMdHome } from "react-icons/io";
import { MdPostAdd } from "react-icons/md";
import { MdOutlinePieChart } from "react-icons/md";
import { IoIosStats } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";


import { GlobalNavi } from "@freee_jp/vibes"
import { useState } from "react";

interface NavTabsProps {
  role: string; 
}

function NavTabs({ role }: NavTabsProps){
  // const [currentPage, setCurrentPage] = useState(window.location.href)

  const employeeNavLinks = [
  {title: role == "employee" ? "My Requests" : "Home",
    url: "/", 
    IconComponent: IoMdHome,
    current: window.location.pathname == "/" ||  (window.location.pathname).match(/^\/requests\.*/) ? true : false 
  }, 
  {title: "Create Request",
    url: "/request/new", 
    IconComponent: MdPostAdd,
    current: window.location.pathname == "/request/new" ? true : false 
   },
]

const adminNavLinks = employeeNavLinks.concat([
  {title: "Summary",
    url: "#", 
    IconComponent: MdOutlinePieChart,
    current: window.location.pathname == "/summary" ? true : false 
   },
   {title: "Reports",
    url: "#", 
    IconComponent: IoIosStats,
    current: window.location.pathname == "/reports" ? true : false 
   },
   {title: "Settings",
    url: "/settings", 
    IconComponent: IoMdSettings,
    current: (window.location.pathname).match(/^\/settings\.*/) ?  true : false
   },
])

  const navLinks = role === "employee" ? employeeNavLinks : adminNavLinks;
    return(
       <GlobalNavi hideHelpForm links = { navLinks }/>
    )
}

export default NavTabs