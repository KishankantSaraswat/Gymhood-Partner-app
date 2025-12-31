import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../../utils/api';

const OverviewSection = ({ gym }) => {
    const [showQR, setShowQR] = useState(false);
    const [dashboardStats, setDashboardStats] = useState({
        activeMembers: 0,
        monthlyRevenue: 0,
        expiringSoon: 0,
        totalPlans: 0,
        nearbyUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    const [activeShift, setActiveShift] = useState(null);
    const [checkinLogs, setCheckinLogs] = useState([]);

    const gymId = gym?._id || "N/A";

    useEffect(() => {
        if (!gym?._id) return;

        const fetchStats = async () => {
            try {
                // Fetch stats in parallel
                const [membersData, revenueData, statsData, plansData, shiftData, logsData] = await Promise.all([
                    api.get(`/gymdb/dashboard/members/${gym._id}`),
                    api.get(`/gymdb/dashboard/revenue/${gym._id}`),
                    api.get(`/gymdb/dashboard/stats/${gym._id}`),
                    api.get(`/gymdb/plans/gym/${gym._id}`),
                    api.get(`/gymdb/gym/${gym._id}/active-capacity`),
                    api.get(`/gymdb/gym/${gym._id}/today-register`)
                ]);

                // Extract active members
                const activeMembers = membersData.success ? membersData.data.planDistribution.totalActiveUsers : 0;

                // Extract monthly revenue (from monthly totals)
                let monthlyRevenue = 0;
                if (revenueData.success && revenueData.data.monthly.totals.length > 0) {
                    monthlyRevenue = revenueData.data.monthly.totals[revenueData.data.monthly.totals.length - 1];
                }

                // Extract nearby users
                const nearbyUsers = statsData.success ? statsData.stats.totalNearbyUsers : 0;

                // Extract plans count
                const totalPlans = plansData.success ? (plansData.plans?.length || 0) : 0;

                setDashboardStats({
                    activeMembers,
                    monthlyRevenue,
                    expiringSoon: 0,
                    totalPlans,
                    nearbyUsers
                });

                if (shiftData.success) setActiveShift(shiftData);
                if (logsData.success) setCheckinLogs(logsData.register || []);

            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [gym?._id]);

    const stats = [
        { title: 'Active Members', value: dashboardStats.activeMembers, icon: 'fas fa-users-viewfinder', color: 'text-[#4f46e5]', bg: 'bg-[#eef2ff]' },
        { title: 'This Month Revenue', value: `₹${dashboardStats.monthlyRevenue.toLocaleString()}`, icon: 'Rs', color: 'text-[#10b981]', bg: 'bg-[#ecfdf5]', isTextIcon: true },
        { title: 'Expiring Soon', value: dashboardStats.expiringSoon, icon: 'fas fa-exclamation-circle', color: 'text-[#f59e0b]', bg: 'bg-[#fffbeb]' },
        { title: 'Total Membership Plans', value: dashboardStats.totalPlans, icon: 'fas fa-tag', color: 'text-[#8b5cf6]', bg: 'bg-[#f5f3ff]' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

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
                                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">{gym?.name || "Arabian gym"}</h3>
                                    </div>
                                    <span className="px-4 py-1.5 bg-[#bbf7d0] text-[#166534] text-[10px] font-black uppercase tracking-wider rounded-full">
                                        {gym?.isVerified ? "Verified" : "Pending"}
                                    </span>
                                </div>

                                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                    {activeShift?.isOpen ? (
                                        <>
                                            <div className="flex justify-between items-center border-b border-white/10 pb-2 sm:pb-3">
                                                <span className="text-emerald-50 text-xs sm:text-sm font-semibold">Current Shift</span>
                                                <div className="text-right">
                                                    <span className="block text-lg sm:text-xl font-black">{activeShift.shiftInfo.name}</span>
                                                    <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">
                                                        {activeShift.shiftInfo.startTime} - {activeShift.shiftInfo.endTime}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center border-b border-white/10 pb-2 sm:pb-3">
                                                <span className="text-emerald-50 text-xs sm:text-sm font-semibold">Capacity</span>
                                                <div className="text-right">
                                                    <span className="block text-lg sm:text-xl font-black">
                                                        {activeShift.activeCount} <span className="text-sm text-white/50">/ {activeShift.capacity}</span>
                                                    </span>
                                                    <div className="w-20 h-1.5 bg-black/20 rounded-full mt-1 ml-auto overflow-hidden">
                                                        <div
                                                            className="h-full bg-white rounded-full transition-all duration-500"
                                                            style={{ width: `${Math.min((activeShift.activeCount / activeShift.capacity) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-emerald-50 text-xs sm:text-sm font-semibold">Gender</span>
                                                <span className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
                                                    {activeShift.shiftInfo.gender}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-6 text-center opacity-80">
                                            <i className="fas fa-moon text-3xl mb-2 block"></i>
                                            <span className="text-lg font-black">Gym Currently Closed</span>
                                            <p className="text-xs mt-1">No active shift running right now.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-4 sm:mb-6">
                                    <div className="flex gap-3 items-start">
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <i className="fas fa-qrcode text-sm sm:text-base"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-0.5 text-xs sm:text-sm">QR Code Entry System</h4>
                                            <p className="text-emerald-50/70 text-[10px] leading-relaxed">
                                                Scan to check-in/out.
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
                                <span>View QR Access Code</span>
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

                            <h2 className="text-2xl font-black text-slate-900 mb-1">{gym?.name || "Arabian Gym"}</h2>
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
                                    <button
                                        onClick={() => navigator.clipboard.writeText(gymId)}
                                        className="text-indigo-600 w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center hover:bg-indigo-100 transition-colors flex-shrink-0"
                                    >
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

                {/* Right Card: Live Check-ins */}
                <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-sm flex flex-col h-[500px]">
                    <div className="flex justify-between items-center mb-6 sm:mb-8">
                        <h3 className="text-lg sm:text-xl font-black text-slate-900">Live Activity</h3>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 sm:space-y-4 custom-scrollbar">
                        {checkinLogs.length > 0 ? (
                            checkinLogs.map((log, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                        {log.photo ? (
                                            <img src={log.photo} alt={log.userName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-black text-indigo-600">{log.userName?.[0]}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 text-sm truncate">{log.userName || "Unknown User"}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Checked In</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-black text-slate-900 text-xs">
                                            {new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                                <i className="fas fa-clipboard-check text-4xl mb-3"></i>
                                <p className="text-xs font-bold uppercase tracking-widest text-center">No check-ins today yet</p>
                            </div>
                        )}
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

