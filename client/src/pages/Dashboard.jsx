import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SubjectCard from '../components/SubjectCard';
import { authFetch } from '../utils/api';

const Dashboard = () => {
    const [subjects, setSubjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [nextClass, setNextClass] = useState(null);
    const [newSubject, setNewSubject] = useState({ name: '', targetPercentage: 75 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subjectsRes, tasksRes, scheduleRes] = await Promise.all([
                    authFetch('/api/subjects'),
                    authFetch('/api/tasks'),
                    authFetch('/api/schedule')
                ]);

                const subjectsData = await subjectsRes.json();
                const tasksData = await tasksRes.json();
                const scheduleData = await scheduleRes.json();

                setSubjects(subjectsData);
                setTasks(tasksData.filter(t => !t.completed).slice(0, 3)); // Top 3 pending tasks

                // Calculate Next Class
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const now = new Date();
                const currentDay = days[now.getDay()];
                const currentTime = now.getHours() + ':' + now.getMinutes();

                const todayClasses = scheduleData.filter(s => s.day === currentDay);
                const upcoming = todayClasses.find(s => s.startTime > currentTime);

                if (upcoming) {
                    setNextClass({ ...upcoming, label: 'Today' });
                } else {
                    // Check tomorrow
                    const nextDayIndex = (now.getDay() + 1) % 7;
                    const nextDay = days[nextDayIndex];
                    const tomorrowClasses = scheduleData.filter(s => s.day === nextDay).sort((a, b) => a.startTime.localeCompare(b.startTime));
                    if (tomorrowClasses.length > 0) {
                        setNextClass({ ...tomorrowClasses[0], label: 'Tomorrow' });
                    } else {
                        setNextClass(null);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!newSubject.name) return;

        try {
            const res = await authFetch('/api/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSubject),
            });
            const data = await res.json();
            setSubjects([...subjects, data]);
            setNewSubject({ name: '', targetPercentage: 75 });
        } catch (error) {
            console.error('Error adding subject:', error);
        }
    };

    const handleUpdateAttendance = async (id, updates) => {
        try {
            const res = await authFetch(`/api/subjects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            const updatedSubject = await res.json();
            setSubjects(subjects.map(sub => sub._id === id ? updatedSubject : sub));
        } catch (error) {
            console.error('Error updating subject:', error);
        }
    };

    const handleDeleteSubject = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await authFetch(`/api/subjects/${id}`, { method: 'DELETE' });
            setSubjects(subjects.filter(sub => sub._id !== id));
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    };

    const overallPercentage = subjects.length > 0
        ? (subjects.reduce((acc, sub) => acc + parseFloat(sub.currentPercentage), 0) / subjects.length).toFixed(1)
        : 0;

    return (
        <div className="container">
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                padding: '1rem 0'
            }}>
                <h1 style={{ margin: 0, fontSize: '1.8rem', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Dashboard
                </h1>
                <nav style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/timetable" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none' }}>Timetable</Link>
                    <Link to="/tasks" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none' }}>Tasks</Link>
                    <Link to="/analytics" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none' }}>Analytics</Link>
                </nav>
            </header>

            {/* Widgets Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>

                {/* Summary Widget */}
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: `conic-gradient(var(--primary) ${overallPercentage}%, rgba(255,255,255,0.1) 0)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(84, 124, 180, 0.2)'
                    }}>
                        <div style={{ width: '65px', height: '65px', background: 'var(--surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.2rem' }}>
                            {overallPercentage}%
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Overall Attendance</div>
                        <div style={{ fontSize: '1.1rem', color: 'white', marginTop: '0.25rem' }}>
                            {overallPercentage >= 75 ? 'On Track 🎯' : 'Attention Needed ⚠️'}
                        </div>
                    </div>
                </div>

                {/* Up Next Widget */}
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--surface))' }}>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                        Up Next
                    </div>
                    {nextClass ? (
                        <div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '0.25rem' }}>{nextClass.subject}</div>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', opacity: 0.9 }}>
                                <span>🕒 {nextClass.startTime}</span>
                                <span>📍 {nextClass.room}</span>
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                {nextClass.label}
                            </div>
                        </div>
                    ) : (
                        <div style={{ opacity: 0.7 }}>No upcoming classes found.</div>
                    )}
                </div>

                {/* Deadlines Widget */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Deadlines</div>
                        <Link to="/tasks" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>View All</Link>
                    </div>
                    {tasks.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {tasks.map(task => (
                                <div key={task._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)' }} />
                                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No pending tasks.</div>
                    )}
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Add New Subject</h2>
                <form onSubmit={handleAddSubject} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Subject Name"
                        value={newSubject.name}
                        onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Target % (e.g. 75)"
                        value={newSubject.targetPercentage}
                        onChange={(e) => setNewSubject({ ...newSubject, targetPercentage: e.target.value })}
                    />
                    <button type="submit" className="btn btn-primary">
                        + Add Subject
                    </button>
                </form>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {subjects.map(subject => (
                        <SubjectCard
                            key={subject._id}
                            subject={subject}
                            onUpdate={handleUpdateAttendance}
                            onDelete={handleDeleteSubject}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
