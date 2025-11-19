import React from "react";
import { useNavigate } from "react-router-dom";

const UserDropdown = ({ onClose }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    onClose();
    navigate("/profile");
  };

  return (
    <div className="absolute right-0 mt-3 w-56 rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden bg-white">
      <ul className="text-sm divide-y">
        <li
          className="flex items-center gap-3 px-4 py-3 cursor-pointer transition hover:bg-gray-100"
          onClick={handleProfileClick}
        >
          <span>My Profile</span>
        </li>
      </ul>
    </div>
  );
};

export default UserDropdown;