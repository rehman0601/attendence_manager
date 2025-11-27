import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                login(data, data.token);
                navigate('/dashboard');
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Something went wrong');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'var(--background-dark)' }}>
            {/* Left Side - Image/Brand */}
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #000, var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }} className="hide-on-mobile">
                <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop") center/cover', opacity: 0.4 }}></div>
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Start Your Journey</h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '400px', margin: '0 auto' }}>Create an account and take control of your academic life today.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem' }}>
                <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Get started for free. No credit card required.</p>

                    {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>Sign Up</button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
