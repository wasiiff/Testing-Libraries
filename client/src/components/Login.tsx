import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../apis/auth";
import { Link } from "react-router-dom";

interface LoginFormInputs {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

// ✅ Validation schema using Yup
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // ✅ Hook form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  // ✅ Handle login
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      const response: LoginResponse = await loginUser(
        data.email,
        data.password
      );
      localStorage.setItem("token", response.token);
      window.location.href = "/";
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-[400px] bg-gray-800 rounded-lg shadow-lg p-6 drop-shadow-[0_0_8px_#01ff9d]">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            data-testid="email-input"
            className="w-full mb-2 p-2 bg-gray-600 text-white rounded-md focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            data-testid="password-input"
            className="w-full mb-2 p-2 bg-gray-600 text-white rounded-md focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            data-testid="login-submit"
            className={`w-full h-10 bg-gradient-to-bl from-[#6a00f4] to-cyan-700 text-white font-semibold rounded-sm ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            data-testid="signup-link"
            className="text-cyan-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
