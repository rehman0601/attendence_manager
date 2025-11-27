import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
    const { token, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !token) {
            navigate('/login');
        }
    }, [token, loading, navigate]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;

    return (
        <div style={{ paddingBottom: '80px' }}> {/* Add padding for bottom nav */}
            <Outlet />
            <div className="hide-on-desktop">
                <BottomNav />
            </div>
        </div>
    );
};

export default AppLayout;
