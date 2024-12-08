import './App.css'
import Layout from './pages/layout.tsx';
import Login from './pages/login.tsx'
import Signup from './pages/signup.tsx';
import Home from './pages/home.tsx';
import Request from './pages/request.tsx';
import Settings from './pages/settings.tsx'

import { Routes, Route, BrowserRouter } from "react-router";


function App() {

  return (
     <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/signup" element={<Signup/>}></Route>
           
            <Route element={<Layout/>}>
              <Route index element={<Home/>}></Route>
              <Route path="/request" element={<Request/>}></Route>
              <Route path="/settings" element={<Settings/>}></Route>
            </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App
