import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_AUTH as string;

// Response type for login/signup (adjust fields if your API differs)
export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// Signup function
export const signupUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(`${API_URL}/register`, {
    name,
    email,
    password,
  });
  return res.data;
};

// Login function
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(`${API_URL}/login`, { email, password });
  return res.data;
};
