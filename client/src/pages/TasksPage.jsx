import React from 'react';
import { Link } from 'react-router-dom';
import TaskManager from '../components/TaskManager';

const TasksPage = () => {
    return (
        <div className="container">
            <Link to="/dashboard" className="btn" style={{ background: 'rgba(255,255,255,0.1)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Task Manager</h1>
            <TaskManager />
        </div>
    );
};

export default TasksPage;
