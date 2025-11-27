import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
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
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                login(data, data.token);
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'var(--background-dark)' }}>
            {/* Left Side - Form */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem' }}>
                <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter your details to access your account.</p>

                    {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>Sign In</button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign up</Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Brand */}
            <div style={{ flex: 1, background: 'linear-gradient(135deg, var(--primary-dark), #000)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }} className="hide-on-mobile">
                <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'url("https://images.unsplash.com/photo-1616531770192-6eaea74c2456?q=80&w=2070&auto=format&fit=crop") center/cover', opacity: 0.4 }}></div>
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Track Your Success</h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '400px', margin: '0 auto' }}>Join thousands of students managing their attendance effortlessly.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
