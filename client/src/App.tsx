import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/signup";
import Login from "./components/Login";
import "./index.css";
import Tasks from "./pages/TaskScreen";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoutes";

const App: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
