import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/login.tsx'
import Signup from './pages/signup.tsx';
import { Routes, Route, BrowserRouter } from "react-router";
import "../node_modules/@freee_jp/vibes/vibes_2021.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/signup" element={<Signup/>}></Route>
        </Routes>
      </BrowserRouter>
  </StrictMode>,
)
