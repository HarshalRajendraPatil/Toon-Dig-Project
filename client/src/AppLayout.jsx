import React from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import { useSelector } from "react-redux";
import axios from "axios";

const AppLayout = () => {
  const role = useSelector((state) => state?.user?.user?.role);

  return (
    <div>
      <Navbar userRole={role} />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
