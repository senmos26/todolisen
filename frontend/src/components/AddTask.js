import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddTask() {
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'low',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Récupérer le token d'authentification du localStorage
      const token = localStorage.getItem('token');
      
      // Envoyer la requête POST pour ajouter la tâche
      await axios.post(
        `${process.env.BACK}/tasks`,
        task,
        {
          headers: {
            'Authorization': `Bearer ${token}` // Inclure le token dans les en-têtes
          },
          withCredentials: true
        }
      );
      
      navigate('/tasks'); // Redirection vers la liste des tâches après ajout
    } catch (error) {
      console.error('Failed to add task', error);
      setError('Failed to add task');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Add New Task</h1>
      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
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

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-medium rounded-lg px-5 py-2.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}
