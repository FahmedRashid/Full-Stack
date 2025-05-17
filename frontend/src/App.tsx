import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { Orders } from "./pages/Orders";
import { About } from "./pages/About";
import { Product } from "./pages/Product";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import { UnderDevelopment } from './pages/UnderDev'

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="app">
          <div className="pages">
            <Routes>
              <Route path="/orders" element={<Orders />} />
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Product />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return(
        <BrowserRouter>
        <AppContent/>
        </BrowserRouter>
  )
}

export default App;
