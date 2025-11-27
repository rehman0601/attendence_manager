
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SubjectCard = ({ subject, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: subject.name,
        targetPercentage: subject.targetPercentage,
        totalClasses: subject.totalClasses,
        attendedClasses: subject.attendedClasses
    });

    const handleSave = () => {
        onUpdate(subject._id, {
            name: editForm.name,
            targetPercentage: parseInt(editForm.targetPercentage),
            totalClasses: parseInt(editForm.totalClasses),
            attendedClasses: parseInt(editForm.attendedClasses)
        });
        setIsEditing(false);
    };

    const currentPercentage = parseFloat(subject.currentPercentage);
    const targetPercentage = subject.targetPercentage;
    const isLowAttendance = currentPercentage < targetPercentage;

    // Calculate classes needed to reach target
    let classesNeeded = 0;
    if (isLowAttendance) {
        let attended = subject.attendedClasses;
        let total = subject.totalClasses;
        while ((attended / total) * 100 < targetPercentage) {
            attended++;
            total++;
            classesNeeded++;
        }
    }

    // Calculate bunkable classes
    let classesCanBunk = 0;
    if (!isLowAttendance) {
        let attended = subject.attendedClasses;
        let total = subject.totalClasses;
        while ((attended / (total + 1)) * 100 >= targetPercentage) {
            total++;
            classesCanBunk++;
        }
    }

    return (
        <div className="card" style={{ position: 'relative', overflow: 'hidden', borderTop: `4px solid ${isLowAttendance ? 'var(--danger)' : 'var(--success)'} ` }}>
            {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target %</label>
                            <input
                                type="number"
                                value={editForm.targetPercentage}
                                onChange={(e) => setEditForm({ ...editForm, targetPercentage: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Classes</label>
                            <input
                                type="number"
                                value={editForm.totalClasses}
                                onChange={(e) => setEditForm({ ...editForm, totalClasses: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Attended</label>
                            <input
                                type="number"
                                value={editForm.attendedClasses}
                                onChange={(e) => setEditForm({ ...editForm, attendedClasses: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>Save</button>
                        <button onClick={() => setIsEditing(false)} className="btn" style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.1)' }}>Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <Link to={`/ subject / ${subject._id} `} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '600' }}>{subject.name}</h3>
                        </Link>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.5, padding: '0.2rem' }}
                                title="Edit"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => onDelete(subject._id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.5, padding: '0.2rem' }}
                                title="Delete"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                            <svg width="80" height="80" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                                <circle
                                    cx="50" cy="50" r="45"
                                    fill="none"
                                    stroke={isLowAttendance ? 'var(--danger)' : 'var(--success)'}
                                    strokeWidth="10"
                                    strokeDasharray={`${currentPercentage * 2.83} 283`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>{currentPercentage}%</span>
                                <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>Target: {targetPercentage}%</span>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Attended:</span>
                                <span>{subject.attendedClasses}/{subject.totalClasses}</span>
                            </div>
                            <div style={{ fontSize: '0.9rem' }}>
                                {isLowAttendance ? (
                                    <span style={{ color: 'var(--danger)' }}>Attend next <strong>{classesNeeded}</strong> classes! 🚨</span>
                                ) : (
                                    <span style={{ color: 'var(--success)' }}>You can bunk <strong>{classesCanBunk}</strong> classes! 🎉</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <button
                            onClick={() => onUpdate(subject._id, { present: true })}
                            className="btn"
                            style={{ background: 'rgba(74, 222, 128, 0.2)', color: 'var(--success)', border: '1px solid rgba(74, 222, 128, 0.3)' }}
                        >
                            Present ✅
                        </button>
                        <button
                            onClick={() => onUpdate(subject._id, { present: false })}
                            className="btn"
                            style={{ background: 'rgba(248, 113, 113, 0.2)', color: 'var(--danger)', border: '1px solid rgba(248, 113, 113, 0.3)' }}
                        >
                            Absent ❌
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SubjectCard;

