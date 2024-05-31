// Popup.jsx
import React from 'react';
import './Popup.css'; // Create this file for styling

const Popup = ({ content, handleClose }) => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={handleClose}>x</span>
        {content}
      </div>
    </div>
  );
};

export default Popup;
