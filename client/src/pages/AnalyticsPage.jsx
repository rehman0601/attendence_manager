import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const AnalyticsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await authFetch('/api/subjects');
                const data = await res.json();
                setSubjects(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    const attendanceData = subjects.map(sub => ({
        name: sub.name,
        attendance: parseFloat(sub.currentPercentage),
        target: sub.targetPercentage
    }));

    const sortedByAttendance = [...subjects].sort((a, b) => parseFloat(b.currentPercentage) - parseFloat(a.currentPercentage));
    const bestSubject = sortedByAttendance[0];
    const worstSubject = sortedByAttendance[sortedByAttendance.length - 1];

    const overallPercentage = subjects.length > 0
        ? (subjects.reduce((acc, sub) => acc + parseFloat(sub.currentPercentage), 0) / subjects.length).toFixed(1)
        : 0;

    const totalClasses = subjects.reduce((acc, sub) => acc + sub.totalClasses, 0);
    const attendedClasses = subjects.reduce((acc, sub) => acc + sub.attendedClasses, 0);
    const bunkedClasses = totalClasses - attendedClasses;

    return (
        <div className="container">
            <Link to="/" className="btn" style={{ background: 'var(--surface)', color: 'var(--text)', display: 'inline-block', marginBottom: '1rem' }}>
                &larr; Back to Dashboard
            </Link>
            <header style={{ marginBottom: '2rem' }}>
                <h1>Analytics Dashboard</h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{overallPercentage}%</div>
                    <div style={{ color: 'var(--text-muted)' }}>Overall Attendance</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>{attendedClasses}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Classes Attended</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--danger)' }}>{bunkedClasses}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Classes Bunked</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3>Best Attendance</h3>
                    {bestSubject ? (
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{bestSubject.name}</div>
                            <div>{bestSubject.currentPercentage}%</div>
                        </div>
                    ) : <p>No data</p>}
                </div>
                <div className="card">
                    <h3>Needs Improvement</h3>
                    {worstSubject ? (
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>{worstSubject.name}</div>
                            <div>{worstSubject.currentPercentage}%</div>
                        </div>
                    ) : <p>No data</p>}
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', height: '400px' }}>
                <h3>Attendance Overview</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--surface)" />
                        <XAxis dataKey="name" stroke="var(--text-muted)" />
                        <YAxis stroke="var(--text-muted)" />
                        <Tooltip contentStyle={{ background: 'var(--surface)', border: 'none', color: 'var(--text)' }} />
                        <Legend />
                        <Bar dataKey="attendance" fill="var(--primary)" name="Attendance %" />
                        <Bar dataKey="target" fill="var(--text-muted)" name="Target %" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="card">
                <h3>Subject Performance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {subjects.map(sub => (
                        <div key={sub._id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>{sub.name}</span>
                                <span style={{ fontWeight: 'bold', color: parseFloat(sub.currentPercentage) < sub.targetPercentage ? 'var(--danger)' : 'var(--success)' }}>{sub.currentPercentage}%</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(parseFloat(sub.currentPercentage), 100)}%`, height: '100%', background: parseFloat(sub.currentPercentage) < sub.targetPercentage ? 'var(--danger)' : 'var(--success)' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
