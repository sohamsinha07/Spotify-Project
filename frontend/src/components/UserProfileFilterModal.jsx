import React from 'react';
import '../styles/UserProfileFilterModal.css';
import { FaCheck } from 'react-icons/fa';
import '../styles/UserProfileFilterModal.css';

const UserProfileFilterModal = ({ activeFilter, setActiveFilter, onClose }) => {
  const filters = ['Past Month', 'Past Year', 'All Time'];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2 className="modal-title">Filter by</h2>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {activeFilter === filter && <FaCheck className="check-icon" />}
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserProfileFilterModal;
