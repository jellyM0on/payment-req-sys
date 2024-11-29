import { Outlet } from "react-router";
import NavBar from "../components/navigation/navBar";

export default function Dashboard() {
  return (
    <>
        <NavBar/>
        <Outlet />
    </>
  );
}