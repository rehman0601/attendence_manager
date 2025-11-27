import React, { useState, useEffect } from 'react';
import { authFetch } from '../utils/api';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', dueDate: '' });
    const [editingTask, setEditingTask] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', dueDate: '' });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await authFetch('/api/tasks');
            const data = await res.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const res = await authFetch('/api/tasks', {
                method: 'POST',
                body: JSON.stringify(newTask),
            });
            const data = await res.json();
            setTasks([...tasks, data]);
            setNewTask({ title: '', dueDate: '' });
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            const res = await authFetch(`/api/tasks/${task._id}`, {
                method: 'PUT',
                body: JSON.stringify({ completed: !task.completed }),
            });
            const updatedTask = await res.json();
            setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await authFetch(`/api/tasks/${id}`, { method: 'DELETE' });
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const startEditing = (task) => {
        setEditingTask(task._id);
        setEditForm({ title: task.title, dueDate: task.dueDate ? task.dueDate.split('T')[0] : '' });
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            const res = await authFetch(`/api/tasks/${editingTask}`, {
                method: 'PUT',
                body: JSON.stringify(editForm),
            });
            const updatedTask = await res.json();
            setTasks(tasks.map(t => t._id === editingTask ? updatedTask : t));
            setEditingTask(null);
            setEditForm({ title: '', dueDate: '' });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div className="card">
            <h2 style={{ marginTop: 0 }}>Tasks & Deadlines</h2>
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="New Task..."
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    style={{ flex: 1 }}
                />
                <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
                <button type="submit" className="btn btn-primary">+</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {tasks.map(task => (
                    <div key={task._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                        {editingTask === task._id ? (
                            <form onSubmit={handleUpdateTask} style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="date"
                                    value={editForm.dueDate}
                                    onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                                />
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button type="button" onClick={() => setEditingTask(null)} className="btn">Cancel</button>
                            </form>
                        ) : (
                            <>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleToggleComplete(task)}
                                    style={{ width: '1.2rem', height: '1.2rem' }}
                                />
                                <div style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.5 : 1 }}>
                                    {task.title}
                                    {task.dueDate && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({new Date(task.dueDate).toLocaleDateString()})</span>}
                                </div>
                                <button onClick={() => startEditing(task)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                                <button onClick={() => handleDeleteTask(task._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>&times;</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskManager;
