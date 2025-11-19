import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userJSON = localStorage.getItem("user");

    if (!userJSON) {
      setIsAdmin(false);
      navigate("/");
      return;
    }

    const user = JSON.parse(userJSON);
    const allowedRoles = ["admin", "seller", "manager"];

    if (!allowedRoles.includes(user.role)) {
      setIsAdmin(false);
      navigate("/");
    } else {
      setIsAdmin(true);
    }
  }, [navigate]);

  if (isAdmin === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        }`}
      >
        <Header setSidebarOpen={setSidebarOpen} />

        {/* 🔥 All admin pages render here */}
        <main className="flex-1 p-4 overflow-y-auto hide-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
