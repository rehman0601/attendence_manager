import React, { useState, useEffect } from 'react';

const Timetable = () => {
    const [schedule, setSchedule] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [newClass, setNewClass] = useState({ day: 'Monday', startTime: '', endTime: '', subject: '', room: '' });
    const [loading, setLoading] = useState(true);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [schedRes, subRes] = await Promise.all([
                    fetch('/api/schedule'),
                    fetch('/api/subjects')
                ]);
                const schedData = await schedRes.json();
                const subData = await subRes.json();
                setSchedule(schedData);
                setSubjects(subData);
                if (subData.length > 0) {
                    setNewClass(prev => ({ ...prev, subject: subData[0]._id }));
                }
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
            const res = await fetch('/api/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClass),
            });
            const data = await res.json();
            setSchedule([...schedule, data]);
            setNewClass({ ...newClass, startTime: '', endTime: '', room: '' });
        } catch (error) {
            console.error('Error adding class:', error);
        }
    };

    const handleDeleteClass = async (id) => {
        if (!window.confirm('Delete this class?')) return;
        try {
            await fetch(`/api/schedule/${id}`, { method: 'DELETE' });
            setSchedule(schedule.filter(s => s._id !== id));
        } catch (error) {
            console.error('Error deleting class:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <form onSubmit={handleAddClass} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                <select
                    value={newClass.day}
                    onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                    style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--surface)', background: 'var(--background)', color: 'var(--text)' }}
                >
                    {days.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
                <input
                    type="time"
                    value={newClass.startTime}
                    onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}
                    required
                />
                <input
                    type="time"
                    value={newClass.endTime}
                    onChange={(e) => setNewClass({ ...newClass, endTime: e.target.value })}
                    required
                />
                <select
                    value={newClass.subject}
                    onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                    style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--surface)', background: 'var(--background)', color: 'var(--text)' }}
                >
                    {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                </select>
                <input
                    type="text"
                    placeholder="Room"
                    value={newClass.room}
                    onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                    style={{ width: '100px' }}
                />
                <button type="submit" className="btn btn-primary">Add Class</button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {days.map(day => {
                    const daySchedule = schedule.filter(s => s.day === day);
                    if (daySchedule.length === 0) return null;

                    return (
                        <div key={day} className="card">
                            <h3 style={{ borderBottom: '1px solid var(--background)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{day}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {daySchedule.map(s => (
                                    <div key={s._id} style={{ background: 'var(--background)', padding: '0.75rem', borderRadius: 'var(--radius)', position: 'relative' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{s.subject.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {s.startTime} - {s.endTime} {s.room && `| ${s.room}`}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteClass(s._id)}
                                            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'var(--danger)', background: 'none', fontSize: '1rem' }}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Timetable;
