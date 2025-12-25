import React, { useState } from 'react';

const Sidebar = ({ activeSection, onSectionChange }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { id: 'overview', icon: 'fas fa-home', label: 'Overview' },
        { id: 'profile', icon: 'fas fa-building', label: 'My Gym Profile' },
        { id: 'revenue', icon: 'fas fa-chart-line', label: 'Revenue Analytics' },
        { id: 'plans', icon: 'fas fa-tags', label: 'Membership Plans' },
        { id: 'announcements', icon: 'fas fa-bullhorn', label: 'Announcements', badge: 2 },
    ];

    const handleMenuClick = (id) => {
        onSectionChange(id);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 right-4 z-50 w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all border border-slate-200"
            >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:relative
                w-72 bg-white border-r border-slate-100 flex-col z-40 h-screen
                transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                md:flex
            `}>
                <div className="h-16 sm:h-20 flex items-center px-4 sm:px-6 border-b border-slate-100">
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

                <div className="p-4 border-t border-slate-200">
                    <button className="w-full flex items-center gap-3 font-medium text-sm text-indigo-600 hover:text-indigo-700 active:scale-95 transition-transform">
                        <i className="fas fa-edit"></i>
                        <span>Edit Gym Profile</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
