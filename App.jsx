import React, { useState } from "react";
import "./index.css";

export default function App() {
  const [taskname, setTaskname] = useState("");
  const [taskdescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("None");
  const [editId, setEditId] = useState(null);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskname.trim() || !taskdescription.trim()) return;

    if (editId) {
      setTasks(
        tasks.map((task) =>
          task.id === editId
            ? {
                ...task,
                name: taskname,
                description: taskdescription,
                dueDate,
                priority
              }
            : task
        )
      );
      setEditId(null);
    } else {
      const newTask = {
        id: Date.now(),
        name: taskname,
        description: taskdescription,
        dueDate,
        priority,
        completed: false
      };
      setTasks([...tasks, newTask]);
    }

    setTaskname("");
    setTaskDescription("");
    setDueDate("");
    setPriority("Low");
  };

  const handleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEdit = (task) => {
    setTaskname(task.name);
    setTaskDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setEditId(task.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Completed") return task.completed;
    if (filter === "Incompleted") return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === "Priority") {
      const order = { High: 3, Medium: 2, Low: 1 };
      return order[b.priority] - order[a.priority];
    }
    if (sort === "Due Date") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white px-4 py-6 overflow-hidden">
      {/* Floating balls */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="floating-ball"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${5 + Math.random() * 10}s`,
            background: `radial-gradient(circle, rgba(255,255,255,0.8), transparent)`
          }}
        ></div>
      ))}

      <header className="text-center mb-6 relative z-10">
        <h1 className="text-3xl font-bold text-purple-300 drop-shadow-lg">
          To-Do List
        </h1>
      </header>

      <div className="flex flex-row gap-5 justify-center mb-6 relative z-10">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-black border border-purple-400 rounded px-3 py-2 focus:outline-none"
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Incompleted">Incompleted</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-black border border-purple-400 rounded px-3 py-2 focus:outline-none"
        >
          <option value="None">Sort By</option>
          <option value="Priority">Priority</option>
          <option value="Due Date">Due Date</option>
        </select>
      </div>

      <div className="bg-black/40 border border-purple-500 shadow-xl rounded-lg p-6 max-w-xl mx-auto relative z-10">
        <h2 className="text-xl font-bold text-center mb-4 text-purple-300">
          {editId ? "Edit Task" : "Add New Task"}
        </h2>
        <form onSubmit={handleAddTask} className="flex flex-col gap-3">
          <input
            value={taskname}
            onChange={(e) => setTaskname(e.target.value)}
            className="border border-purple-500 bg-black/50 text-white text-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Task Name"
          />
          <textarea
            value={taskdescription}
            placeholder="Task Description"
            className="border border-purple-500 bg-black/50 text-white text-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={(e) => setTaskDescription(e.target.value)}
          ></textarea>
          <label className="font-bold text-purple-300">Due Date</label>
          <input
            type="date"
            value={dueDate}
            className="border border-purple-500 bg-black/50 text-white text-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={(e) => setDueDate(e.target.value)}
          />
          <label className="font-bold text-purple-300">Priority</label>
          <select
            value={priority}
            className="border border-purple-500 bg-black/50 text-white text-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button className="bg-gradient-to-r from-pink-400 to-purple-700 py-2 rounded-lg w-1/2 mx-auto hover:opacity-80 transition">
            {editId ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>

      <div className="mt-6 max-w-xl mx-auto relative z-10">
        {sortedTasks.length === 0 ? (
          <p className="text-center text-gray-400">No tasks found.</p>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`border border-purple-500 p-4 rounded-lg mb-3 shadow-lg ${
                task.completed ? "bg-green-900/40" : "bg-black/40"
              }`}
            >
              <h3 className="font-bold text-purple-300">{task.name}</h3>
              <p className="text-gray-300">{task.description}</p>
              <p className="text-sm text-gray-400">Due: {task.dueDate}</p>
              <p className="text-sm text-gray-400">Priority: {task.priority}</p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleComplete(task.id)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1 bg-yellow-600 hover:bg-yellowss-700 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
