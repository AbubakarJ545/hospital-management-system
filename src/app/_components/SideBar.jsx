"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GrOverview } from "react-icons/gr";
import { FaPeopleGroup, FaUserDoctor } from "react-icons/fa6";
import { FaClock, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { IoPeopleCircleSharp, IoSettingsSharp } from "react-icons/io5";
import { FcDepartment } from "react-icons/fc";
import { MdOutlinePayments } from "react-icons/md";
import { GiDoctorFace } from "react-icons/gi";
import Link from "next/link";

const Sidebar = () => {
  const router = useRouter();
  const menuItems = [
    {
      icon: <GrOverview className="text-base" />,
      label: "Dashboard",
      path: "/Admin",
    },
    {
      icon: <FaPeopleGroup className="text-base" />,
      label: "Patient",
      path: "/Patient",
    },
    {
      icon: <FaClock className="text-base" />,
      label: "Receptionist",
      path: "/ReceptionistDashboard",
    },
    {
      icon: <FaUserDoctor className="text-base" />,
      label: "Doctors",
      path: "/Doctors",
    },
    {
      icon: <GiDoctorFace className="text-base" />,
      label: "Doctors Dashboard",
      path: "/DoctorDashboard",
    },
    {
      icon: <IoPeopleCircleSharp className="text-base" />,
      label: "Employee",
      path: "/Employee",
    },
    {
      icon: <FcDepartment className="text-base" />,
      label: "Department",
      path: "/Department",
    },
    {
      icon: <MdOutlinePayments className="text-base" />,
      label: "Payment",
      path: "/Payment",
    },
    {
      icon: <IoSettingsSharp className="text-base" />,
      label: "Settings",
      path: "/Settings",
    },
  ];

  const pathname = usePathname();
  const [isClose, setIsClose] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState("");

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarState");
    if (savedState === "closed") setIsClose(true);
  }, []);

  // Save sidebar state whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarState", isClose ? "closed" : "open");
  }, [isClose]);

  // Set active menu item
  useEffect(() => {
    const currentItem = menuItems.find((item) => item.path === pathname);
    if (currentItem) setActive(currentItem.label);
  }, [pathname]);

  return (
    <div
      className={`bg-white shadow-lg p-4 flex flex-col relative`}
      onMouseEnter={() => isClose && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: hovered || !isClose ? "14rem" : "4rem",
        transition: "width 0.2s ease",
      }}
    >
      {/* Toggle Button */}
      <button
        className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
        onClick={() => setIsClose(!isClose)}
      >
        {isClose ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
      </button>

      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        className="flex items-center gap-2 mb-8 mt-6 cursor-pointer"
      >
        <img src="/logo.png" alt="WeCare Logo" className="w-8 h-8" />
        {(hovered || !isClose) && (
          <h1 className="text-xl font-bold text-green-600">WeCare</h1>
        )}
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-3 text-gray-700 text-sm">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className={`p-2 rounded flex items-center gap-2 
              ${
                active === item.label
                  ? "bg-green-200 text-green-700 font-semibold"
                  : "hover:bg-green-100"
              }`}
          >
            {item.icon}
            {(hovered || !isClose) && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
