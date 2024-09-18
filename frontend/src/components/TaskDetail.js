import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import BackButton from './BackButton';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Pour la navigation après suppression
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_BACK}/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Inclure le token dans les en-têtes
        },
        withCredentials: true
      });
      navigate('/tasks'); // Redirige vers la liste des tâches après suppression
    } catch (error) {
      console.error("Failed to delete the task", error);
      setError('Failed to delete task');
    }
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.BACK}/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Inclure le token dans les en-têtes
          },
          withCredentials: true
        });
        setTask(response.data.task);
      } catch (err) {
        console.error('Failed to fetch task data', err);
        setError('Failed to fetch task data');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        <BackButton />
      </div>

      {task ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-6">{task.title}</h1>
          <p className="text-gray-700 text-center mb-4">{task.description || 'No description provided'}</p>

          <div className="flex justify-around mb-4">
            <div className="flex flex-col items-center">
              <strong className="text-gray-700">Status</strong>
              <span className="text-lg capitalize">{task.status}</span>
            </div>
            <div className="flex flex-col items-center">
              <strong className="text-gray-700">Priority</strong>
              <span className="text-lg capitalize">{task.priority}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-around">
            <button
              onClick={() => navigate(`/tasks/edit/${task._id}`)} 
              // Navigue vers la page d'édition
              className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              <FaEdit className="mr-2" />
              Edit Task
            </button>
            <button
              onClick={() => {
                if (window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
                  onDelete(task._id); // Utiliser task._id au lieu de id
                }
              }}
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              <FaTrash className="mr-2" />
              Delete Task
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500">Task not found</div>
      )}
    </div>
  );
}
