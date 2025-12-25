import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const OverviewSection = () => {
    const [showQR, setShowQR] = useState(false);
    const gymId = "69116cbb50a140e3e70fb54";

    const stats = [
        { title: 'Active Members', value: '234', icon: 'fas fa-users-viewfinder', color: 'text-[#4f46e5]', bg: 'bg-[#eef2ff]' },
        { title: 'This Month Revenue', value: '₹42,000', icon: 'Rs', color: 'text-[#10b981]', bg: 'bg-[#ecfdf5]', isTextIcon: true },
        { title: 'Expiring Soon', value: '12', icon: 'fas fa-exclamation-circle', color: 'text-[#f59e0b]', bg: 'bg-[#fffbeb]' },
        { title: 'Total Membership Plans', value: '3', icon: 'fas fa-tag', color: 'text-[#8b5cf6]', bg: 'bg-[#f5f3ff]' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-slate-500">{stat.title}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                            {stat.isTextIcon ? (
                                <span className="font-bold text-lg">{stat.icon}</span>
                            ) : (
                                <i className={`${stat.icon} text-xl`}></i>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* Left Card: Gym Profile with Flip Animation */}
                <div className="lg:col-span-7 min-h-[450px] sm:min-h-[500px] lg:h-[500px]" style={{ perspective: '1000px' }}>
                    <div
                        className={`relative w-full h-full transition-transform duration-700 ${showQR ? '[transform:rotateY(180deg)]' : ''}`}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front Side */}
                        <div
                            className="absolute inset-0 bg-[#45b1a8] rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-6 lg:p-8 text-white shadow-lg overflow-hidden flex flex-col justify-between"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4 sm:mb-6 lg:mb-8">
                                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                            <i className="fas fa-dumbbell text-lg sm:text-xl"></i>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">Arabian gym</h3>
                                    </div>
                                    <span className="px-4 py-1.5 bg-[#bbf7d0] text-[#166534] text-[10px] font-black uppercase tracking-wider rounded-full">
                                        Verified
                                    </span>
                                </div>

                                <div className="space-y-3 sm:space-y-4 lg:space-y-6 mb-4 sm:mb-6 lg:mb-10">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2 sm:pb-3 lg:pb-4">
                                        <span className="text-emerald-50 text-xs sm:text-sm font-semibold">Total Nearby Users:</span>
                                        <span className="text-xl sm:text-2xl font-black">0</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2 sm:pb-3 lg:pb-4">
                                        <span className="text-emerald-50 text-xs sm:text-sm font-semibold">Potential Customers:</span>
                                        <span className="text-xl sm:text-2xl font-black">0</span>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 border border-white/10 mb-4 sm:mb-6 lg:mb-8">
                                    <div className="flex gap-3 sm:gap-4 items-start">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <i className="fas fa-qrcode text-base sm:text-lg"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1 text-sm sm:text-base">QR Code Setup Reminder</h4>
                                            <p className="text-emerald-50/70 text-xs leading-relaxed">
                                                If you haven't created QR codes yet, please generate them and place them strategically in your gym for member access.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowQR(true)}
                                className="w-full py-3 sm:py-3.5 lg:py-4 bg-[#001d3d] text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3 hover:bg-[#003566] transition-all transform active:scale-[0.98] shadow-xl z-10"
                            >
                                <i className="fas fa-qrcode"></i>
                                <span>Generate QR Codes</span>
                            </button>

                            {/* Decorative elements */}
                            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        </div>

                        {/* Back Side - QR Code */}
                        <div
                            className="absolute inset-0 bg-slate-50 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-6 lg:p-8 shadow-lg flex flex-col items-center justify-center overflow-y-auto"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                            <button
                                onClick={() => setShowQR(false)}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-all border border-slate-100"
                            >
                                <i className="fas fa-times"></i>
                            </button>

                            <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-200 mb-6 border-4 border-white">
                                <i className="fas fa-qrcode text-3xl"></i>
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 mb-1">Arabian Gym</h2>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-8 text-center">Membership Pass</p>

                            <div className="relative mb-8 p-5 bg-white rounded-[2rem] border border-slate-200 shadow-inner">
                                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)] animate-scan z-10 opacity-50"></div>
                                <div className="relative p-2 bg-white rounded-xl">
                                    <QRCodeSVG
                                        value={gymId}
                                        size={180}
                                        level="H"
                                        includeMargin={false}
                                        className="mx-auto"
                                    />
                                </div>
                            </div>

                            <div className="w-full max-w-md space-y-3">
                                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="truncate pr-3">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Secure ID</p>
                                        <code className="text-xs font-mono font-black text-slate-700">{gymId}</code>
                                    </div>
                                    <button className="text-indigo-600 w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center hover:bg-indigo-100 transition-colors flex-shrink-0">
                                        <i className="fas fa-copy text-sm"></i>
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="py-4 bg-slate-900 text-white rounded-[1.5rem] font-bold text-xs tracking-wider shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2">
                                        <i className="fas fa-download"></i> SAVE
                                    </button>
                                    <button className="py-4 bg-[#2d6a4f] text-white rounded-[1.5rem] font-bold text-xs tracking-wider shadow-xl hover:bg-[#1b4332] transition-all flex items-center justify-center gap-2">
                                        <i className="fas fa-share-nodes"></i> SHARE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Card: Quick Actions */}
                <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-6 sm:mb-8">Quick Actions</h3>

                    <div className="space-y-3 sm:space-y-4">
                        {[
                            { title: 'Add New Member', icon: 'fas fa-user-plus', color: 'text-[#4f46e5]', bg: 'bg-[#f1f5f9]' },
                            { title: 'Send Announcement', icon: 'fas fa-bullhorn', color: 'text-[#0ea5e9]', bg: 'bg-[#f1f5f9]' },
                            { title: 'Performance Report', icon: 'fas fa-chart-pie', color: 'text-[#8b5cf6]', bg: 'bg-[#f1f5f9]' },
                        ].map((action, i) => (
                            <button key={i} className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#f8fafc] hover:bg-white hover:shadow-lg hover:shadow-indigo-500/5 transition-all group border border-transparent hover:border-slate-100 active:scale-95">
                                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${action.bg} ${action.color} flex items-center justify-center text-base sm:text-lg shadow-sm group-hover:scale-110 transition-transform`}>
                                    <i className={action.icon}></i>
                                </div>
                                <span className="font-bold text-sm sm:text-base text-slate-700">{action.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scan {
          0% { top: 10%; }
          100% { top: 90%; }
        }
        .animate-scan {
          animation: scan 2.5s ease-in-out infinite;
        }
      `}} />
        </div>
    );
};

export default OverviewSection;

