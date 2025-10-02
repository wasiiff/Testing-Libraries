import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_TASKS as string;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Define a Task interface
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Response for stats (example, adapt to your API)
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

export const getAllTasks = async (): Promise<Task[]> => {
  const res = await axios.get<Task[]>(`${API_URL}`, getAuthHeaders());
  return res.data;
};

export const getTasksByTitle = async (title: string): Promise<Task[]> => {
  const res = await axios.get<Task[]>(
    `${API_URL}/task?title=${encodeURIComponent(title)}`,
    getAuthHeaders()
  );
  return res.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const res = await axios.get<Task>(`${API_URL}/${id}`, getAuthHeaders());
  return res.data;
};

export const createTask = async (
  title: string,
  completed = false
): Promise<Task> => {
  const res = await axios.post<Task>(
    `${API_URL}`,
    { title, completed },
    getAuthHeaders()
  );
  return res.data;
};

export const updateTask = async (
  id: string,
  title: string,
  completed: boolean
): Promise<Task> => {
  const res = await axios.put<Task>(
    `${API_URL}/${id}`,
    { title, completed },
    getAuthHeaders()
  );
  return res.data;
};

export const deleteTask = async (id: string): Promise<{ message: string }> => {
  const res = await axios.delete<{ message: string }>(
    `${API_URL}/${id}`,
    getAuthHeaders()
  );
  return res.data;
};

export const getTaskStats = async (): Promise<TaskStats> => {
  const res = await axios.get<TaskStats>(`${API_URL}/stats`, getAuthHeaders());
  return res.data;
};
