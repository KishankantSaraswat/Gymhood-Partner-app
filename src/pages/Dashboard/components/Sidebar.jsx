import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';

const Sidebar = ({ activeSection, onSectionChange, gym, isOpen, onClose }) => {
    const [announcementCount, setAnnouncementCount] = useState(0);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await api.get('/gymdb/announcements/gym');
                if (data.success) {
                    setAnnouncementCount(data.announcements.length);
                }
            } catch (err) {
                console.error('Error fetching announcement count:', err);
            }
        };

        fetchAnnouncements();
    }, []);

    const menuItems = [
        { id: 'overview', icon: 'fas fa-home', label: 'Overview' },
        { id: 'profile', icon: 'fas fa-building', label: 'My Gym Profile' },
        { id: 'revenue', icon: 'fas fa-chart-line', label: 'Revenue Analytics' },
        { id: 'plans', icon: 'fas fa-tags', label: 'Membership Plans' },
        { id: 'announcements', icon: 'fas fa-bullhorn', label: 'Announcements', badge: announcementCount },
        { id: 'payment-history', icon: 'fas fa-history', label: 'Payment History' },
        { id: 'payment-contact', icon: 'fas fa-id-card', label: 'Payment Contact Info' },
    ];

    const handleMenuClick = (id) => {
        onSectionChange(id);
        onClose(); // Close sidebar on mobile when item clicked
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fade-in"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:relative
                w-72 bg-white border-r border-slate-100 flex-col z-[70] h-screen
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                md:flex
            `}>
                <div className="h-16 sm:h-20 flex items-center px-4 sm:px-6 border-b border-slate-100 justify-between">
                    <div className="flex items-center">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#6366f1] flex items-center justify-center text-white mr-3 shadow-indigo-200 shadow-lg">
                            <i className="fas fa-dumbbell text-base sm:text-lg"></i>
                        </div>
                        <div className="flex flex-col leading-none pt-1">
                            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                                Gymshood
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#6366f1] mt-0.5">
                                Partner
                            </span>
                        </div>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 sm:py-6">
                    <nav className="space-y-1 sm:space-y-2">
                        {menuItems.map((item) => (
                            <a
                                key={item.id}
                                href="#"
                                onClick={(e) => { e.preventDefault(); handleMenuClick(item.id); }}
                                className={`flex items-center px-4 sm:px-6 py-3 sm:py-4 font-bold transition-all relative group ${activeSection === item.id
                                    ? 'bg-[#eef2ff] text-[#4f46e5]'
                                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 active:scale-95'
                                    }`}
                            >
                                <i className={`${item.icon} w-8 text-base sm:text-lg`}></i>
                                <span className="text-sm tracking-tight">{item.label}</span>
                                {item.badge && (
                                    <span className="ml-auto bg-[#fee2e2] text-[#ef4444] text-[10px] font-black px-2 py-1 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                                {activeSection === item.id && (
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#4f46e5] rounded-l-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"></div>
                                )}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                    <div className="space-y-3">
                        <button
                            onClick={() => onSectionChange('profile')}
                            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 group transition-all duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <i className="fas fa-store text-xs"></i>
                                </div>
                                <span className="font-bold text-slate-700 text-sm group-hover:text-slate-900">Edit Profile</span>
                            </div>
                            <i className="fas fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all"></i>
                        </button>

                        <button
                            onClick={() => {
                                localStorage.removeItem('gymshood_token');
                                localStorage.removeItem('token');
                                window.location.href = '/login';
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-100 hover:text-red-700 active:scale-[0.98] transition-all"
                        >
                            <i className="fas fa-right-from-bracket"></i>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
