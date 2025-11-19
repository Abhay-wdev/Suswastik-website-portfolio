import React from "react";
import { Link } from "react-router-dom";

const LoginSignupButton = () => {
  return (
    <div className="flex items-center gap-3">
      <Link
        to="/login"
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Login
      </Link>

      {/* Uncomment if you want signup button */}
      {/* 
      <Link
        to="/signup"
        className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
      >
        Sign Up
      </Link>
      */}
    </div>
  );
};

export default LoginSignupButton;
