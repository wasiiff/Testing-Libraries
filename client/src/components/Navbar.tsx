import { useNavigate } from "react-router-dom";
import React from "react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token: string | null = localStorage.getItem("token");

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-auto h-16 flex justify-between items-center px-6 bg-white/40 backdrop-blur-md sticky top-0 z-50">
      <h1
        className="text-gradient text-3xl font-bold bg-gradient-to-r from-purple-950 to-black bg-clip-text text-transparent cursor-pointer"
        onClick={() => navigate("/")}
      >
        TaskAlly
      </h1>

      <div className="flex gap-4">
        {!token ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-700 to-cyan-700 text-white font-medium hover:opacity-90 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-700 to-purple-700 text-white font-medium hover:opacity-90 transition"
            >
              Signup
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-red-600 to-orange-500 text-white font-medium hover:opacity-90 transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
