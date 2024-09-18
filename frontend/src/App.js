import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Tasks from './components/Tasks';
import TaskDetail from './components/TaskDetail';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK}/auth/check`, { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK}/auth/logout`, {}, { withCredentials: true });
      if (response.status === 200) {
        localStorage.removeItem('user'); // Supprimer les informations de l'utilisateur du localStorage
        setIsAuthenticated(false);
        navigate('/login');
      } else {
        console.error('Failed to log out: unexpected response', response);
      }
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  return (
    <div>
    <div className="flex flex-wrap justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold mb-4 sm:mb-0">Todolisen</h1>
      <div className="flex flex-row space-x-4 items-center">
        {isAuthenticated ? (
          <>
            <Link className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-center" to="/tasks/add">
              Add Task
            </Link>
            <Link className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-center" to="/tasks">
              Tasks
            </Link>
            <button className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-center" onClick={   handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-center" to="/login">
              Login
            </Link>
            <Link className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-center" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  
    <Routes>
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tasks" element={isAuthenticated ? <Tasks /> : <Navigate to="/login" />} />
      <Route path="/tasks/add" element={isAuthenticated ? <AddTask /> : <Navigate to="/login" />} />
      <Route path="/tasks/edit/:id" element={isAuthenticated ? <EditTask /> : <Navigate to="/login" />} />
      <Route path="/tasks/:id" element={isAuthenticated ? <TaskDetail /> : <Navigate to="/login" />} />
    </Routes>
  </div>
  
  );
}

export default App;
