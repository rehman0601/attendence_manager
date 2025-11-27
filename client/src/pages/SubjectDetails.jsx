import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NotesSection from '../components/NotesSection';
import { authFetch } from '../utils/api';

const SubjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState(null);
    const [exams, setExams] = useState([]);
    const [newExam, setNewExam] = useState({ name: '', totalMarks: 100, obtainedMarks: 0, date: '' });
    const [editingExam, setEditingExam] = useState(null); // Track which exam is being edited
    const [editForm, setEditForm] = useState({}); // Form data for editing

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subjectRes = await authFetch('/api/subjects');
                const subjects = await subjectRes.json();
                const sub = subjects.find(s => s._id === id);
                setSubject(sub);

                const examsRes = await authFetch(`/api/exams/${id}`);
                const examsData = await examsRes.json();
                setExams(examsData);
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };
        fetchData();
    }, [id]);

    const handleAddExam = async (e) => {
        e.preventDefault();
        try {
            const res = await authFetch('/api/exams', {
                method: 'POST',
                body: JSON.stringify({ ...newExam, subjectId: id }),
            });
            const data = await res.json();
            setExams([data, ...exams]);
            setNewExam({ name: '', totalMarks: 100, obtainedMarks: 0, date: '' });
        } catch (error) {
            console.error('Error adding exam:', error);
        }
    };

    const handleDeleteExam = async (examId) => {
        if (!window.confirm('Delete this exam?')) return;
        try {
            await authFetch(`/api/exams/${examId}`, { method: 'DELETE' });
            setExams(exams.filter(e => e._id !== examId));
        } catch (error) {
            console.error('Error deleting exam:', error);
        }
    };

    const startEditingExam = (exam) => {
        setEditingExam(exam._id);
        setEditForm({ ...exam });
    };

    const handleUpdateExam = async (e) => {
        e.preventDefault();
        try {
            const res = await authFetch(`/api/exams/${editingExam}`, {
                method: 'PUT',
                body: JSON.stringify(editForm),
            });
            const updatedExam = await res.json();
            setExams(exams.map(ex => ex._id === editingExam ? updatedExam : ex));
            setEditingExam(null);
            setEditForm({});
        } catch (error) {
            console.error('Error updating exam:', error);
        }
    };

    if (!subject) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <Link to="/dashboard" className="btn" style={{ background: 'rgba(255,255,255,0.1)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>

            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{subject.name}</h1>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                    <span>Target: <span style={{ color: 'white' }}>{subject.targetPercentage}%</span></span>
                    <span>Current: <span style={{ color: parseFloat(subject.currentPercentage) < subject.targetPercentage ? 'var(--danger)' : 'var(--success)', fontWeight: 'bold' }}>{subject.currentPercentage}%</span></span>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Exams Section */}
                <div>
                    <h2 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Exams & Marks</h2>

                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3>Add Exam</h3>
                        <form onSubmit={handleAddExam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Exam Name (e.g. Mid-Sem)"
                                value={newExam.name}
                                onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                            />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="number"
                                    placeholder="Obtained"
                                    value={newExam.obtainedMarks}
                                    onChange={(e) => setNewExam({ ...newExam, obtainedMarks: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Total"
                                    value={newExam.totalMarks}
                                    onChange={(e) => setNewExam({ ...newExam, totalMarks: e.target.value })}
                                />
                            </div>
                            <input
                                type="date"
                                value={newExam.date}
                                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                            />
                            <button type="submit" className="btn btn-primary">Add Exam</button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {exams.map(exam => (
                            <div key={exam._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {editingExam === exam._id ? (
                                    <form onSubmit={handleUpdateExam} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        />
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                type="number"
                                                value={editForm.obtainedMarks}
                                                onChange={(e) => setEditForm({ ...editForm, obtainedMarks: e.target.value })}
                                            />
                                            <input
                                                type="number"
                                                value={editForm.totalMarks}
                                                onChange={(e) => setEditForm({ ...editForm, totalMarks: e.target.value })}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button type="submit" className="btn btn-primary" style={{ padding: '0.3rem' }}>Save</button>
                                            <button type="button" onClick={() => setEditingExam(null)} className="btn" style={{ padding: '0.3rem', background: 'var(--surface)' }}>Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{exam.name}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{new Date(exam.date).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                                {exam.obtainedMarks}/{exam.totalMarks}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                                {((exam.obtainedMarks / exam.totalMarks) * 100).toFixed(1)}%
                                            </div>
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <button onClick={() => startEditingExam(exam)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '0.5rem' }}>✏️</button>
                                                <button onClick={() => handleDeleteExam(exam._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>🗑️</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notes Section */}
                <NotesSection subjectId={id} />
            </div>
        </div>
    );
};

export default SubjectDetails;
