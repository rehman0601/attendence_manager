import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '../utils/api';

const TimetablePage = () => {
    const [schedule, setSchedule] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [newClass, setNewClass] = useState({ day: 'Monday', subject: '', startTime: '', endTime: '', room: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scheduleRes, subjectsRes] = await Promise.all([
                    authFetch('/api/schedule'),
                    authFetch('/api/subjects')
                ]);
                const scheduleData = await scheduleRes.json();
                const subjectsData = await subjectsRes.json();
                setSchedule(scheduleData);
                setSubjects(subjectsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddClass = async (e) => {
        e.preventDefault();
        try {
            const res = await authFetch('/api/schedule', {
                method: 'POST',
                body: JSON.stringify(newClass),
            });
            const data = await res.json();
            setSchedule([...schedule, data]);
            setNewClass({ day: 'Monday', subject: '', startTime: '', endTime: '', room: '' });
        } catch (error) {
            console.error('Error adding class:', error);
        }
    };

    const handleDeleteClass = async (id) => {
        if (!window.confirm('Delete this class?')) return;
        try {
            await authFetch(`/api/schedule/${id}`, { method: 'DELETE' });
            setSchedule(schedule.filter(s => s._id !== id));
        } catch (error) {
            console.error('Error deleting class:', error);
        }
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="container">
            <Link to="/dashboard" className="btn" style={{ background: 'rgba(255,255,255,0.1)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Weekly Timetable</h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Add Class</h3>
                <form onSubmit={handleAddClass} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    <select
                        value={newClass.day}
                        onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                        style={{ padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        {days.map(day => <option key={day} value={day} style={{ color: 'black' }}>{day}</option>)}
                    </select>
                    <select
                        value={newClass.subject}
                        onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                        style={{ padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        <option value="" style={{ color: 'black' }}>Select Subject</option>
                        {subjects.map(sub => <option key={sub._id} value={sub.name} style={{ color: 'black' }}>{sub.name}</option>)}
                    </select>
                    <input
                        type="time"
                        value={newClass.startTime}
                        onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}
                        style={{ padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                    />
                    <input
                        type="time"
                        value={newClass.endTime}
                        onChange={(e) => setNewClass({ ...newClass, endTime: e.target.value })}
                        style={{ padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                    />
                    <input
                        type="text"
                        placeholder="Room (e.g. 301)"
                        value={newClass.room}
                        onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                        style={{ padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                    />
                    <button type="submit" className="btn btn-primary">Add to Schedule</button>
                </form>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {days.map(day => {
                    const dayClasses = schedule.filter(s => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
                    if (dayClasses.length === 0) return null;

                    return (
                        <div key={day} className="card">
                            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{day}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {dayClasses.map(cls => (
                                    <div key={cls._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ fontWeight: 'bold', color: 'var(--primary)', minWidth: '100px' }}>
                                                {cls.startTime} - {cls.endTime}
                                            </div>
                                            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{cls.subject}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Room: {cls.room}</div>
                                        </div>
                                        <button onClick={() => handleDeleteClass(cls._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', opacity: 0.7 }}>&times;</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                {schedule.length === 0 && !loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No classes scheduled yet.</p>}
            </div>
        </div>
    );
};

export default TimetablePage;
