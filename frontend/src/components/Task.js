import React from "react";
import TaskIcon from "./TaskIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Task = ({ task, onView, onEdit, onDelete }) => {
  return (
    <tr className="border-b">
      <td className="px-4 py-2 text-xs text-center">
        <Link to={`${task._id}`} className="block w-full h-full">
          {task.title}
        </Link>
      </td>
      <td className="px-4 py-2 text-center">
        <Link to={`${task._id}`} className="block w-full h-full">
          <TaskIcon type="status" value={task.status} />
        </Link>
      </td>
      <td className="px-4 py-2 text-center">
        <Link to={`${task._id}`} className="block w-full h-full">
          <TaskIcon type="priority" value={task.priority} />
        </Link>
      </td>
      <td className="px-4 py-2 flex justify-center space-x-2">
        <button
          onClick={onView}
          className="text-blue-500 hover:text-blue-700"
        >
          <Link to={`${task._id}`}>
              <FontAwesomeIcon icon={faEye} />
            </Link>
        </button>
        <button
          onClick={onEdit}
          className="text-yellow-500 hover:text-yellow-700"
        ><Link to={`edit/${task._id}`}>
        <FontAwesomeIcon icon={faEdit} />
      </Link>
          
        </button>
        <button
            onClick={ ()=>  window.confirm("Voulez-vous vraiment supprimer ?") && onDelete(task._id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
};

export default Task;
