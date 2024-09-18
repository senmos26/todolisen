import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from './BackButton';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'low',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_BACK}/tasks/${id}`, task, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });
      navigate('/tasks'); // Redirection vers la liste des tâches après mise à jour
    } catch (error) {
      console.error('Failed to update task', error);
      setError('Failed to update task. Please try again.');
    }
  };

  // Fonction pour récupérer les détails de la tâche
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_BACK}/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <BackButton />
      <h1 className="text-2xl font-bold text-center mb-4">Edit Task</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-900">Title</label>
          <input 
            type="text" 
            id="title" 
            name="title"
            className="mt-1 p-2.5 w-full bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Task Title"
            value={task.title}
            onChange={handleChange}
            required 
          />
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-900">Description</label>
          <textarea
            id="description"
            name="description"
            className="mt-1 p-2.5 w-full bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Task Description"
            value={task.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Status Field */}
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-900">Status</label>
          <select 
            id="status" 
            name="status"
            className="mt-1 p-2.5 w-full bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            value={task.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority Field */}
        <div className="mb-4">
          <label htmlFor="priority" className="block text-sm font-medium text-gray-900">Priority</label>
          <select 
            id="priority" 
            name="priority"
            className="mt-1 p-2.5 w-full bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            value={task.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-between">
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-medium rounded-lg px-5 py-2.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Edit Task
          </button>
          <button 
            type="button"
            onClick={() => navigate('/tasks')}
            className="w-full bg-gray-600 text-white font-medium rounded-lg px-5 py-2.5 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
