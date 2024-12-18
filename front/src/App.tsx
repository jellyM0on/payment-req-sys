import "./App.css";
import Layout from "./pages/layout.tsx";
import Login from "./pages/login.tsx";
// import Signup from './pages/signup.tsx';
import HomeContainer from "./pages/home.tsx";
import ViewRequestContainer from "./pages/viewRequest.tsx";
import EditRequestContainer from "./pages/editRequest.tsx";
import CreateUserContainer from "./pages/createUser.tsx";
import EditUserContainer from "./pages/editUser.tsx";
import NotFoundContainer from "./pages/notFound.tsx";

import Request from "./pages/createRequest.tsx";
import Settings from "./pages/settings.tsx";

import { Routes, Route, BrowserRouter, Navigate } from "react-router";

import { useAuthContext } from "./providers/authProvider.tsx";

function App() {
  const { isAuthenticated, user } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>

        <Route element={<Layout />}>
          <Route index element={<HomeContainer />}></Route>
          <Route path="/requests/:id" element={<ViewRequestContainer />} />
          <Route
            path="/requests/:id/edit"
            element={<EditRequestContainer />}
          ></Route>
          <Route path="/request/new" element={<Request />}></Route>
          <Route
            path="/settings"
            element={
              isAuthenticated && user && user.role == "Admin" ? (
                <Settings />
              ) : (
                <Navigate to="/404" />
              )
            }
          ></Route>
          <Route
            path="/settings/new"
            element={
              isAuthenticated && user && user.role == "Admin" ? (
                <CreateUserContainer />
              ) : (
                <Navigate to="/404" />
              )
            }
          ></Route>
          <Route
            path="/settings/user/:id"
            element={
              isAuthenticated && user && user.role == "Admin" ? (
                <EditUserContainer />
              ) : (
                <Navigate to="/404" />
              )
            }
          ></Route>
          <Route path="*" element={<NotFoundContainer />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
