import { useNavigate } from "react-router-dom";
import React from "react";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400 drop-shadow-lg">
        Welcome to TaskAlly
      </h1>

      <p className="mt-4 text-lg text-gray-300 max-w-2xl">
        Organize your tasks, boost your productivity, and achieve more every
        day. TaskAlly helps you track, edit, and complete your to-do list
        effortlessly.
      </p>

      <div className="mt-8 flex gap-4">
        {!token ? (
          <>
            <button
              data-testid="login-btn"
              onClick={() => navigate("/login")}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-700 to-cyan-700 text-white text-lg font-semibold hover:opacity-90 transition"
            >
              Login
            </button>
            <button
              data-testid="signup-btn"
              onClick={() => navigate("/signup")}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-700 to-purple-700 text-white text-lg font-semibold hover:opacity-90 transition"
            >
              Signup
            </button>
          </>
        ) : (
          <button
            data-testid="go-tasks-btn"
            onClick={() => navigate("/tasks")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-700 text-white text-lg font-semibold hover:opacity-90 transition"
          >
            Go to Tasks
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
