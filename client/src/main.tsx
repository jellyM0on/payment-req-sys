import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/login.tsx'
import Signup from './pages/signup.tsx';
import Dashboard from './pages/dashboard.tsx';
import Home from './pages/home.tsx';
import Request from './pages/request.tsx';


import { Routes, Route, BrowserRouter } from "react-router";
import "../node_modules/@freee_jp/vibes/vibes_2021.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>,
)
