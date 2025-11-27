import React, { useState, useEffect } from 'react';
import { authFetch } from '../utils/api';

const NotesSection = ({ subjectId }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await authFetch('/api/notes');
                const data = await res.json();
                setNotes(data.filter(n => n.subject === subjectId));
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };
        fetchNotes();
    }, [subjectId]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        try {
            const res = await authFetch('/api/notes', {
                method: 'POST',
                body: JSON.stringify({ content: newNote, subject: subjectId }),
            });
            const data = await res.json();
            setNotes([data, ...notes]);
            setNewNote('');
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await authFetch(`/api/notes/${id}`, { method: 'DELETE' });
            setNotes(notes.filter(n => n._id !== id));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const startEditing = (note) => {
        setEditingNote(note._id);
        setEditContent(note.content);
    };

    const handleUpdateNote = async (e) => {
        e.preventDefault();
        try {
            const res = await authFetch(`/api/notes/${editingNote}`, {
                method: 'PUT',
                body: JSON.stringify({ content: editContent }),
            });
            const updatedNote = await res.json();
            setNotes(notes.map(n => n._id === editingNote ? updatedNote : n));
            setEditingNote(null);
            setEditContent('');
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    return (
        <div className="card">
            <h3>Notes</h3>
            <form onSubmit={handleAddNote} style={{ marginBottom: '1rem' }}>
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a quick note..."
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'white', minHeight: '60px' }}
                />
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Add Note</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {notes.map(note => (
                    <div key={note._id} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {editingNote === note._id ? (
                            <form onSubmit={handleUpdateNote} style={{ width: '100%' }}>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'white', minHeight: '60px', marginBottom: '0.5rem' }}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ padding: '0.3rem 0.8rem' }}>Save</button>
                                    <button type="button" onClick={() => setEditingNote(null)} className="btn" style={{ padding: '0.3rem 0.8rem', background: 'var(--surface)' }}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div style={{ whiteSpace: 'pre-wrap', flex: 1 }}>{note.content}</div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
                                    <button onClick={() => startEditing(note)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}>✏️</button>
                                    <button onClick={() => handleDeleteNote(note._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', opacity: 0.6 }}>&times;</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotesSection;
