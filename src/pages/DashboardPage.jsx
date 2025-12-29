import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Dashboard/components/Sidebar';
import OverviewSection from './Dashboard/components/OverviewSection';
import ProfileSection from './Dashboard/components/ProfileSection';
import RevenueSection from './Dashboard/components/RevenueSection';
import PlansSection from './Dashboard/components/PlansSection';
import AnnouncementsSection from './Dashboard/components/AnnouncementsSection';
import api from '../utils/api';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const [gymData, setGymData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('gymshood_token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                // Get owner's gym details
                const data = await api.get('/gymdb/gym/owner/me');
                if (data.success && data.gyms && data.gyms.length > 0) {
                    setGymData(data.gyms[0]);
                } else {
                    setError('No gym found for this account.');
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message);
                if (err.message.includes('authenticated') || err.message.includes('token')) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const titles = {
        'overview': 'Dashboard Overview',
        'profile': 'My Gym Profile',
        'revenue': 'Revenue Analytics',
        'plans': 'Membership Plans',
        'announcements': 'Announcements'
    };

    const renderSection = () => {
        if (loading) return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );

        if (error) return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-exclamation-triangle text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h3>
                <p className="text-slate-500 mb-6 max-w-md">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );

        switch (activeSection) {
            case 'overview': return <OverviewSection gym={gymData} />;
            case 'profile': return <ProfileSection gym={gymData} />;
            case 'revenue': return <RevenueSection gym={gymData} />;
            case 'plans': return <PlansSection gym={gymData} />;
            case 'announcements': return <AnnouncementsSection gym={gymData} />;
            default: return <OverviewSection gym={gymData} />;
        }
    };

    const ownerName = JSON.parse(localStorage.getItem('user'))?.name || 'Owner';
    const initials = ownerName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    return (
        <div className="bg-slate-50 min-h-screen flex overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} gym={gymData} />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="h-16 sm:h-20 bg-white border-b border-slate-100 flex items-center px-4 sm:px-6 md:px-10 z-10 justify-between">
                    {/* Left: Logo and Title (visible on mobile) */}
                    <div className="flex items-center gap-3">
                        {/* Logo - visible only on mobile */}
                        <div className="md:hidden flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-[#6366f1] flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
                                <i className="fas fa-dumbbell text-sm"></i>
                            </div>
                            <div className="flex flex-col leading-none pt-1">
                                <span className="text-base font-black text-slate-900 tracking-tight">
                                    Gymshood
                                </span>
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#6366f1] mt-0.5">
                                    Partner
                                </span>
                            </div>
                        </div>

                        {/* Title - hidden on mobile, visible on desktop */}
                        <h1 className="hidden md:block text-xl sm:text-2xl font-black text-[#1e293b]">{titles[activeSection]}</h1>
                    </div>

                    {/* Right: Icons (hidden on mobile) and Menu button (visible on mobile) */}
                    <div className="flex items-center gap-3 sm:gap-5">
                        {/* Notification and Profile - hidden on mobile */}
                        <button className="hidden md:flex w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f1f5f9] items-center justify-center text-[#64748b] hover:text-indigo-600 transition-all border border-slate-100 active:scale-95">
                            <i className="fas fa-bell"></i>
                        </button>
                        <div className="hidden md:flex w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#4f46e5] items-center justify-center text-white font-bold border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform text-sm sm:text-base">
                            {initials || 'JD'}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                    {renderSection()}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
