import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: '🏠' },
        { path: '/timetable', label: 'Schedule', icon: '📅' },
        { path: '/tasks', label: 'Tasks', icon: '✅' },
        { path: '/analytics', label: 'Stats', icon: '📊' },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(4, 28, 84, 0.85)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '0.8rem 0',
            zIndex: 1000,
            // In a real app, we'd use a media query to hide this on desktop
            // For this demo, we'll let it show or assume mobile-first view
        }} className="mobile-nav">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            textDecoration: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.3rem',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            transition: 'color 0.3s'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default BottomNav;
