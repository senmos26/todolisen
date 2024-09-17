import React, { useEffect, useState } from "react";
import axios from "axios";
import Task from "./Task";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Récupérer le token du localStorage
    const token = localStorage.getItem('token'); // Assurer que le token est stocké avec ce nom

    // Envoyer une requête GET avec le token d'authentification
    axios
      .get("https://todolisen-tlot.vercel.app/tasks", {
        headers: {
          'Authorization': `Bearer ${token}`  // Utiliser le token JWT pour l'authentification
        },
        withCredentials: true // Assurer que les cookies sont envoyés avec la requête
      })
      .then((response) => {
        setTasks(response.data.tasks);
        console.log(response.data.tasks);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to fetch tasks");
      });
  }, []);

  const onDelete = async (taskId) => {
    try {
      await axios.delete(`${process.env.BACK}/tasks/${taskId}`, { 
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, // Envoyer le token avec la requête
        withCredentials: true
      });
      setTasks(tasks.filter((task) => task._id !== taskId)); // Met à jour la liste des tâches
    } catch (error) {
      console.error("Failed to delete the task", error);
      setError("Failed to delete the task");
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {error && <div className="text-red-500 text-center my-2">{error}</div>}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Title</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Priority</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length <= 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">No tasks here!!!</td>
            </tr>
          ) : (
            tasks.map((task) => (
              <Task
                key={task._id}
                task={task}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
