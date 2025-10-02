import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signupUser } from "../apis/auth";
import { Link } from "react-router-dom";

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  token?: string;
}

// ✅ Yup Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // ✅ React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: yupResolver(schema),
  });

  // ✅ Handle signup
  const onSubmit = async (data: SignupFormInputs) => {
    try {
      setLoading(true);
      const response: SignupResponse = await signupUser(
        data.name,
        data.email,
        data.password
      );

      // If API sends token
      // if (response.token) localStorage.setItem("token", response.token);

      window.location.href = "/login";
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-[400px] bg-gray-800 rounded-lg shadow-lg p-6 drop-shadow-[0_0_8px_#01ff9d]">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            {...register("name")}
            data-testid="name-input"
            className="w-full mb-2 p-2 bg-gray-600 text-white rounded-md focus:outline-none"
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            data-testid="confirm-password-input"
            className="w-full mb-2 p-2 bg-gray-600 text-white rounded-md focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            data-testid="signup-submit"
            className={`w-full h-10 bg-gradient-to-bl from-[#6a00f4] to-cyan-700 text-white font-semibold rounded-sm ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            data-testid="login-link"
            className="text-cyan-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
