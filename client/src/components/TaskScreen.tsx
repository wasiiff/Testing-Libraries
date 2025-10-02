import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../apis/tasks";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

interface TaskFormInputs {
  title: string;
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormInputs>();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await getAllTasks();
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleAddTask = async (data: TaskFormInputs) => {
    try {
      await createTask(data.title);
      reset(); // reset input after submission
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      for (let task of tasks) {
        await deleteTask(task._id);
      }
      setTasks([]);
    } catch (err) {
      console.error("Error clearing all tasks:", err);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      await updateTask(task._id, task.title, !task.completed);
      fetchTasks();
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const handleEdit = async (task: Task) => {
    if (editingId === task._id) {
      try {
        await updateTask(task._id, editText, task.completed);
        setEditingId(null);
        fetchTasks();
      } catch (err) {
        console.error("Error saving edit:", err);
      }
    } else {
      setEditingId(task._id);
      setEditText(task.title);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <>
      <div className="w-full h-auto bg-gray-900 flex justify-center items-center mt-4 px-3">
        <div className="w-full md:w-1/2 h-auto bg-gray-800 rounded-lg shadow-lg flex justify-center items-center gap-2 p-4 drop-shadow-[0_0_8px_#01ff9d]">
          <form
            className="flex w-full gap-2"
            onSubmit={handleSubmit(handleAddTask)}
            data-testid="task-form"
          >
            <input
              type="text"
              placeholder="Enter Your Task"
              {...register("title", { required: "Task is required" })}
              data-testid="task-input"
              className="flex-1 h-9 text-white bg-gray-600 p-2 rounded-md focus:outline-none"
            />
            <button
              type="submit"
              data-testid="task-add-btn"
              className="w-16 h-9 bg-gradient-to-bl from-[#6a00f4] to-cyan-700 text-white font-normal rounded-sm text-sm md:text-base"
            >
              Add
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              data-testid="task-clear-btn"
              className="w-18 h-9 bg-gradient-to-tl from-[#6a00f4] to-cyan-700 text-white font-normal rounded-sm text-sm md:text-base"
            >
              Clear All
            </button>
          </form>
        </div>
        {errors.title && (
          <p className="text-red-400 text-sm mt-1" data-testid="task-error">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="px-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            data-testid={`task-${task._id}`}
            className={`w-full md:w-1/2 p-4 flex justify-between rounded-lg shadow-lg items-center mt-4 mx-auto gap-2 text-white bg-gray-800 ${
              task.completed
                ? "line-through drop-shadow-[0_0_10px_#000] bg-emerald-700"
                : "drop-shadow-[0_0_10px_#FF00AA] opacity-70"
            }`}
          >
            {editingId === task._id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                data-testid={`task-edit-input-${task._id}`}
                className="flex-1 bg-gray-700 text-white p-2 rounded"
                autoFocus
              />
            ) : (
              <p
                className="flex-1 cursor-pointer truncate"
                onClick={() => handleToggle(task)}
                title={task.title}
                data-testid={`task-title-${task._id}`}
              >
                {task.title}
              </p>
            )}
            <button
              className="w-16 h-9 bg-gradient-to-bl from-[#6a00f4] to-cyan-700 text-white font-normal rounded-sm"
              onClick={() => handleEdit(task)}
              disabled={task.completed}
              data-testid={`task-edit-btn-${task._id}`}
            >
              {editingId === task._id ? "Save" : "Edit"}
            </button>
            <button
              className="w-16 h-9 bg-gradient-to-bl from-[#6a00f4] to-cyan-700 text-white font-normal rounded-sm"
              onClick={() => handleDelete(task._id)}
              disabled={task.completed}
              data-testid={`task-delete-btn-${task._id}`}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
