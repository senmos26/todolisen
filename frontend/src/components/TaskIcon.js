import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faSpinner, faCheckCircle, faArrowDown, faArrowUp, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const TaskIcon = ({ type, value }) => {
  const getIcon = () => {
    if (type === 'status') {
      switch (value) {
        case 'pending':
          return <FontAwesomeIcon icon={faClock} />;
        case 'in-progress':
          return <FontAwesomeIcon icon={faSpinner} spin />;
        case 'completed':
          return <FontAwesomeIcon icon={faCheckCircle} />;
        default:
          return null;
      }
    } else if (type === 'priority') {
      switch (value) {
        case 'low':
          return <FontAwesomeIcon icon={faArrowDown} />;
        case 'medium':
          return <FontAwesomeIcon icon={faExclamationTriangle} />;
        case 'high':
          return <FontAwesomeIcon icon={faArrowUp} />;
        default:
          return null;
      }
    }
  };

  return <span>{getIcon()}</span>;
};

export default TaskIcon;
