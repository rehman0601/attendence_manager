import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-1px' }}>
                    Attendance<span style={{ color: 'var(--primary)' }}>Manager</span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <a href="#features" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Features</a>
                    <a href="#pricing" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pricing</a>
                    <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                        Launch App
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="container" style={{ textAlign: 'center', padding: '6rem 0 4rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    background: 'rgba(84, 124, 180, 0.1)',
                    color: 'var(--primary)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(84, 124, 180, 0.2)'
                }}>
                    ✨ The #1 Student Productivity Tool
                </div>
                <h1 style={{ fontSize: '4rem', lineHeight: '1.1', marginBottom: '1.5rem', maxWidth: '800px' }}>
                    Never Miss a <span style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Class</span> Again.
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '3rem', lineHeight: '1.6' }}>
                    Track your attendance, manage your GPA, and stay on top of assignments with the most aesthetic student dashboard ever built.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                        Get Started for Free
                    </Link>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: 'var(--border)', color: 'var(--text)', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                        View Demo
                    </button>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" style={{ background: 'rgba(0,0,0,0.2)', padding: '6rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Everything you need to ace the semester</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Powerful features wrapped in a beautiful interface.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <FeatureCard
                            icon="📊"
                            title="Smart Attendance"
                            desc="Auto-calculates your percentage and warns you when you're running low."
                        />
                        <FeatureCard
                            icon="🎓"
                            title="GPA Tracking"
                            desc="Log your exam scores and visualize your academic progress over time."
                        />
                        <FeatureCard
                            icon="☁️"
                            title="Cloud Sync"
                            desc="Access your dashboard from your phone, tablet, or laptop instantly."
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="container" style={{ padding: '6rem 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Simple, Transparent Pricing</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Start for free, upgrade for power.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                    <PricingCard
                        title="Student"
                        price="$0"
                        features={['Unlimited Subjects', 'Basic Analytics', 'Local Storage']}
                    />
                    <PricingCard
                        title="Pro"
                        price="$5"
                        period="/mo"
                        isPopular
                        features={['Everything in Student', 'Cloud Sync', 'Advanced GPA Graphs', 'Priority Support']}
                    />
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: 'var(--border)', padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <div className="container">
                    &copy; 2025 Attendance Manager. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="card" style={{ padding: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{desc}</p>
    </div>
);

const PricingCard = ({ title, price, period = '', features, isPopular }) => (
    <div className="card" style={{
        padding: '2.5rem',
        border: isPopular ? '1px solid var(--primary)' : 'var(--border)',
        position: 'relative'
    }}>
        {isPopular && (
            <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--primary)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600'
            }}>
                MOST POPULAR
            </div>
        )}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{title}</h3>
        <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '2rem' }}>
            {price}<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '400' }}>{period}</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left' }}>
            {features.map((feat, i) => (
                <li key={i} style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--success)' }}>✓</span> {feat}
                </li>
            ))}
        </ul>
        <button className={`btn ${isPopular ? 'btn-primary' : ''}`} style={{ width: '100%', background: isPopular ? '' : 'rgba(255,255,255,0.05)' }}>
            Choose {title}
        </button>
    </div>
);

export default LandingPage;
