import './App.css'
import Login from './pages/login.tsx'
import Signup from './pages/signup.tsx';
import Dashboard from './pages/dashboard.tsx';
import Home from './pages/home.tsx';
import Request from './pages/request.tsx';

import { Routes, Route, BrowserRouter } from "react-router";


function App() {

  return (
     <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/signup" element={<Signup/>}></Route>

            <Route element={<Dashboard/>}>
              <Route index element={<Home/>}></Route>
              <Route path="/request" element={<Request/>}></Route>
            </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App
