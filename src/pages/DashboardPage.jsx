import React, { useState } from 'react';
import Sidebar from './Dashboard/components/Sidebar';
import OverviewSection from './Dashboard/components/OverviewSection';
import ProfileSection from './Dashboard/components/ProfileSection';
import RevenueSection from './Dashboard/components/RevenueSection';
import PlansSection from './Dashboard/components/PlansSection';
import AnnouncementsSection from './Dashboard/components/AnnouncementsSection';

const DashboardPage = () => {
    const [activeSection, setActiveSection] = useState('overview');

    const titles = {
        'overview': 'Dashboard Overview',
        'profile': 'My Gym Profile',
        'revenue': 'Revenue Analytics',
        'plans': 'Membership Plans',
        'announcements': 'Announcements'
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'overview': return <OverviewSection />;
            case 'profile': return <ProfileSection />;
            case 'revenue': return <RevenueSection />;
            case 'plans': return <PlansSection />;
            case 'announcements': return <AnnouncementsSection />;
            default: return <OverviewSection />;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen flex overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

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
                            JD
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