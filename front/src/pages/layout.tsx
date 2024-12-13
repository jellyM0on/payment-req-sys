import { Outlet } from "react-router";
import NavBar from "../components/navigation/navBar";
import { useAuthContext } from "../providers/authProvider";
import { Navigate } from "react-router";
import { useState, useEffect } from "react";
import { ContentsBase, MarginBase } from "@freee_jp/vibes";

export default function Layout() {
  const [checkStatus, setCheckStatus] = useState(false);

  const { user, processDone } = useAuthContext();

  useEffect(() => {
    if (processDone) {
      setCheckStatus(true);
    }
    console.log(checkStatus);
  }, [processDone]);

  if (checkStatus && user) {
    console.log("yes user");
    return (
      <>
        <NavBar name={user.name} role={user.role} />
        <ContentsBase paddingSize="small" mr={3} ml={3} mt={2} mb={2}>
          <MarginBase mr={3} ml={3}>
            <Outlet />
          </MarginBase>
        </ContentsBase>
      </>
    );
  }

  if (checkStatus && user == null) {
    console.log("no user");
    return <Navigate to="/login" />;
  }
}
