
import NavHeader from "./navHeader"
import NavTabs from "./navTabs"

interface NavBarProps{
    name: string, 
    role: string
}

function NavBar({ name, role }: NavBarProps){
    return(
        <>
            <NavHeader name={name}/>
            <NavTabs role={role}/>
        </>
    )
}

export default NavBar