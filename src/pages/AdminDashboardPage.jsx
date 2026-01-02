import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Shield, LayoutDashboard, Dumbbell, Coins, Megaphone, Search, Filter, Eye, TrendingUp, Users, DollarSign, AlertCircle, ArrowUpRight, ArrowDownRight, Zap, Award, Calendar, Bell, Settings, LogOut, Menu, X, ChevronRight, Activity, Loader, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const [animateStats, setAnimateStats] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalGyms: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingGyms: 0,
        revenueData: [],
        gymTypeData: [],
        topGyms: []
    });

    const [gymsList, setGymsList] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', target: 'ALL_USERS', targetGyms: [] });
    const [revenuePeriod, setRevenuePeriod] = useState('totalRevenue');
    const [selectedGym, setSelectedGym] = useState(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    useEffect(() => {
        fetchData();
        setTimeout(() => setAnimateStats(true), 100);
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, gymsRes, annRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/gyms/admin-all'),
                api.get('/admin/announcements/user')
            ]);

            if (statsRes.success) setStats(statsRes.stats);
            if (gymsRes.success) setGymsList(gymsRes.gyms);
            if (annRes.success) setAnnouncements(annRes.announcements);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyToggle = async (gymId) => {
        try {
            const data = await api.put(`/admin/gym/${gymId}/toggle-verify`);
            if (data.success) {
                setGymsList(prev => prev.map(g => g._id === gymId ? { ...g, isVerified: data.isVerified } : g));
                // Also refresh stats to update pending count
                const statsRes = await api.get('/admin/stats');
                if (statsRes.success) setStats(statsRes.stats);
            }
        } catch (err) {
            alert('Verification failed');
        }
    };

    const handleSendAnnouncement = async () => {
        if (!newAnnouncement.title || !newAnnouncement.message) {
            alert('Please fill in title and message');
            return;
        }
        try {
            let finalTargetType = newAnnouncement.target;
            let finalTargetGyms = [];

            // If a specific gym is selected from dropdown
            const isSingleGymId = gymsList.some(g => g._id === newAnnouncement.target);
            if (isSingleGymId) {
                finalTargetType = 'SPECIFIC_GYMS';
                finalTargetGyms = [newAnnouncement.target];
            } else if (newAnnouncement.target === 'SPECIFIC_GYMS') {
                finalTargetGyms = newAnnouncement.targetGyms;
            }

            const data = await api.post('/admin/announcements', {
                title: newAnnouncement.title,
                message: newAnnouncement.message,
                targetType: finalTargetType,
                targetGyms: finalTargetGyms
            });
            if (data.success) {
                alert('Announcement sent!');
                setNewAnnouncement({ title: '', message: '', target: 'ALL', targetGyms: [] });
                // Refresh announcements
                const annRes = await api.get('/admin/announcements/user');
                if (annRes.success) setAnnouncements(annRes.announcements);
            }
        } catch (err) {
            alert('Failed to send announcement');
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        try {
            const data = await api.delete(`/admin/announcements/${id}`);
            if (data.success) {
                alert('Announcement deleted');
                const annRes = await api.get('/admin/announcements/user');
                if (annRes.success) setAnnouncements(annRes.announcements);
            }
        } catch (err) {
            alert('Failed to delete announcement');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const fetchGymDetails = async (gymId) => {
        setIsModalLoading(true);
        try {
            const data = await api.get(`/admin/gym/${gymId}/details`);
            if (data.success) {
                setSelectedGym(data);
            }
        } catch (err) {
            alert('Failed to fetch gym details');
        } finally {
            setIsModalLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-12 h-12 text-violet-600 animate-spin" />
                    <p className="text-slate-500 font-bold">Loading Admin Panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 overflow-hidden font-sans">
            {/* Mobile Menu */}
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-50 md:hidden bg-white p-3 rounded-2xl shadow-xl border border-slate-100"
            >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <aside className={`fixed md:relative w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="h-20 flex items-center px-6 border-b border-slate-200 bg-gradient-to-r from-violet-600 to-indigo-600">
                    <div className="w-12 h-12 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center text-white mr-4 shadow-lg">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="font-black text-xl text-white">Gymshood</span>
                        <p className="text-xs text-white text-opacity-80 font-medium">Admin Panel</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                    {[
                        { icon: LayoutDashboard, label: 'Dashboard', section: 'overview' },
                        { icon: Dumbbell, label: 'Gym Partners', section: 'gyms' },
                        // { icon: Coins, label: 'Revenue', section: 'revenue' },
                        { icon: Megaphone, label: 'Announcements', section: 'announcements' }
                    ].map(({ icon: Icon, label, section }) => (
                        <button key={section} onClick={() => { setActiveSection(section); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-semibold transition-all ${activeSection === section ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                                }`}>
                            <Icon className="w-5 h-5" />
                            <span>{label}</span>
                            {activeSection === section && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 space-y-2">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-semibold text-red-600 hover:bg-red-50 transition-all">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg">A</div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-slate-900">Super Admin</p>
                            <p className="text-xs text-slate-500 truncate">admin@gymshood.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shadow-sm">
                    <div className="pl-14 md:pl-0">
                        <h1 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            {activeSection === 'overview' ? 'Dashboard Overview' : activeSection === 'gyms' ? 'Gym Partners' : activeSection === 'revenue' ? 'Revenue Analytics' : 'Announcements'}
                        </h1>
                        <p className="hidden sm:block text-sm text-slate-500 font-medium mt-1">Welcome back, Super Admin</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-3 hover:bg-slate-100 rounded-2xl transition-all">
                            <Bell className="w-5 h-5 text-slate-600" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>
                        {/* <span className="text-xs font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-5 py-2.5 rounded-full hidden sm:flex items-center gap-2 shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            System Online
                        </span> */}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Overview */}
                    {activeSection === 'overview' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { icon: Dumbbell, label: 'Total Gyms', value: stats.totalGyms, change: '+', gradient: 'from-violet-500 to-purple-600' },
                                    { icon: Users, label: 'Total Users', value: stats.totalUsers, change: '+', gradient: 'from-blue-500 to-cyan-600' },
                                    { icon: DollarSign, label: 'Total Revenue', value: `₹${Number(stats.totalRevenue).toLocaleString('en-IN')}`, change: '+', gradient: 'from-emerald-500 to-teal-600' },
                                    { icon: AlertCircle, label: 'Pending', value: stats.pendingGyms, change: 'Action', gradient: 'from-orange-500 to-red-600' }
                                ].map(({ icon: Icon, label, value, change, gradient }, idx) => (
                                    <div key={idx} className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-xl transform transition-all duration-700 hover:scale-105 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600">
                                                <ArrowUpRight className="w-4 h-4" />{change}
                                            </span>
                                        </div>
                                        <h3 className="text-slate-500 text-sm font-semibold mb-2 uppercase">{label}</h3>
                                        <p className="text-4xl font-black text-slate-900">{value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                                    <h3 className="font-black text-2xl text-slate-900 flex items-center gap-3 mb-6">
                                        <Activity className="w-7 h-7 text-violet-600" />Platform Growth
                                    </h3>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={stats.revenueData}>
                                                <defs>
                                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                <XAxis dataKey="month" stroke="#94a3b8" />
                                                <YAxis stroke="#94a3b8" />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorRevenue)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                                    <h3 className="font-black text-xl text-slate-900 mb-6 flex items-center gap-2">
                                        <Award className="w-6 h-6 text-amber-500" />Quick Stats
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-semibold text-slate-600">Verified Gyms</span>
                                                <Zap className="w-4 h-4 text-violet-600" />
                                            </div>
                                            <p className="text-2xl font-black text-slate-900">{stats.totalGyms - stats.pendingGyms}/{stats.totalGyms}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-semibold text-slate-600">Pending Approvals</span>
                                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <p className="text-2xl font-black text-slate-900">{stats.pendingGyms}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Gyms */}
                    {activeSection === 'gyms' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h2 className="text-2xl font-black text-slate-900">Gym Partners Management</h2>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:flex-none">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input type="text" placeholder="Search gyms..." className="pl-12 pr-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-violet-500 w-full sm:w-64 bg-white shadow-sm" />
                                    </div>
                                    <button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                                        <Filter className="w-4 h-4" /> Period:
                                        <select
                                            value={revenuePeriod}
                                            onChange={(e) => setRevenuePeriod(e.target.value)}
                                            className="bg-transparent border-none outline-none text-white font-bold cursor-pointer"
                                        >
                                            <option value="totalRevenue" className="text-slate-900">All Time</option>
                                            <option value="currentMonth" className="text-slate-900">Current Month</option>
                                            <option value="lastMonth" className="text-slate-900">Last Month</option>
                                            <option value="last3Months" className="text-slate-900">Last 3 Months</option>
                                            <option value="last6Months" className="text-slate-900">Last 6 Months</option>
                                        </select>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                                            <th className="p-5 text-left font-bold">Gym Name</th>
                                            <th className="p-5 text-left font-bold">Owner</th>
                                            <th className="p-5 text-left font-bold">Location</th>
                                            <th className="p-5 text-left font-bold">Rating</th>
                                            <th className="p-5 text-left font-bold">Revenue</th>
                                            <th className="p-5 text-left font-bold">Total Balance</th>
                                            <th className="p-5 text-left font-bold">Status</th>
                                            <th className="p-5 text-right font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {gymsList.map((gym, idx) => (
                                            <tr key={idx}
                                                onClick={() => fetchGymDetails(gym._id)}
                                                className="hover:bg-violet-50 transition-all cursor-pointer group">
                                                <td className="p-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">{gym.name[0]}</div>
                                                        <span className="font-bold text-slate-900">{gym.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-slate-600 font-medium">{gym.owner?.name || 'N/A'}</td>
                                                <td className="p-5 text-slate-600 font-medium">{gym.location?.address?.split(',')[0] || 'Unknown'}</td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-1">
                                                        <Award className="w-4 h-4 text-amber-500" />
                                                        <span className="font-bold text-slate-900">{gym.avgRating || '0.0'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className="font-bold text-slate-900">
                                                        {`₹${Number(gym.revenueBreakdown?.[revenuePeriod] || 0).toLocaleString('en-IN')}`}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <span className="font-bold text-emerald-600">
                                                        {`₹${Number(gym.walletBalance || 0).toLocaleString('en-IN')}`}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${gym.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{gym.isVerified ? 'Verified' : 'Pending'}</span>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleVerifyToggle(gym._id);
                                                        }}
                                                        className={`px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-all ${gym.isVerified ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg'
                                                            }`}
                                                    >
                                                        {gym.isVerified ? 'Revoke' : 'Verify Now'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Revenue */}
                    {activeSection === 'revenue' && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-black text-slate-900">Global Revenue Analytics</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                                    <h3 className="font-black text-xl text-slate-900 mb-6">Revenue by Gym Type</h3>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={stats.gymTypeData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                                                    {stats.gymTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                                    <h3 className="font-black text-xl text-slate-900 mb-6">Top Performing Gyms</h3>
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {stats.topGyms.map((gym, idx) => (
                                            <div key={idx} className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-violet-50 hover:to-purple-50 transition-all border border-slate-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg text-white ${idx === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : idx === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' : 'bg-gradient-to-br from-violet-500 to-purple-600'}`}>{idx + 1}</div>
                                                        <div>
                                                            <span className="font-bold text-slate-900 block">{gym.name}</span>
                                                            <span className={`text-xs font-bold flex items-center gap-1 ${gym.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                                {gym.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{gym.growth}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="font-black text-xl text-slate-900">₹{Number(gym.revenue).toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Announcements */}
                    {activeSection === 'announcements' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl self-start">
                                <h3 className="font-black text-xl text-slate-900 mb-6 flex items-center gap-2">
                                    <Megaphone className="w-6 h-6 text-violet-600" />Create Announcement
                                </h3>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Target Audience</label>
                                        <select
                                            value={newAnnouncement.target}
                                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, target: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-violet-500 outline-none font-bold text-slate-700"
                                        >
                                            <option value="ALL">All (Everyone)</option>
                                            <option value="ALL_USERS">All Users</option>
                                            <option value="ALL_GYMS">All Gym Owners</option>
                                            <option value="SPECIFIC_GYMS">Multiple Gyms (Select...)</option>
                                            <optgroup label="Individual Gyms">
                                                {gymsList.map(gym => (
                                                    <option key={gym._id} value={gym._id}>{gym.name}</option>
                                                ))}
                                            </optgroup>
                                            <option value="SPECIFIC_USERS">Specific Users (By ID)</option>
                                        </select>
                                    </div>
                                    {newAnnouncement.target === 'SPECIFIC_GYMS' && (
                                        <div className="animate-fade-in">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Select Gyms</label>
                                            <div className="max-h-40 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                                                {gymsList.map(gym => (
                                                    <label key={gym._id} className="flex items-center gap-2 p-2 hover:bg-white rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                                        <input
                                                            type="checkbox"
                                                            checked={newAnnouncement.targetGyms.includes(gym._id)}
                                                            onChange={(e) => {
                                                                const updated = e.target.checked
                                                                    ? [...newAnnouncement.targetGyms, gym._id]
                                                                    : newAnnouncement.targetGyms.filter(id => id !== gym._id);
                                                                setNewAnnouncement({ ...newAnnouncement, targetGyms: updated });
                                                            }}
                                                            className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                                        />
                                                        <span className="text-sm font-bold text-slate-700">{gym.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-2 font-bold px-1">{newAnnouncement.targetGyms.length} gyms selected</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={newAnnouncement.title}
                                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-violet-500 outline-none"
                                            placeholder="Enter title..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                        <textarea
                                            rows={4}
                                            value={newAnnouncement.message}
                                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-violet-500 outline-none resize-none"
                                            placeholder="Enter message..."
                                        />
                                    </div>
                                    <button
                                        onClick={handleSendAnnouncement}
                                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-2xl font-black hover:shadow-2xl transition-all"
                                    >
                                        Send Announcement
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-violet-600" />Announcement History
                                </h3>
                                <div className="space-y-4">
                                    {announcements.length > 0 ? announcements.map((a, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl hover:shadow-2xl transition-all relative group">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-black text-slate-900 text-lg">{a.title}</h4>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleDeleteAnnouncement(a._id)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                        title="Delete Announcement"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                    <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                                                        {new Date(a.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-slate-600 mb-5">{a.message}</p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 px-4 py-2 rounded-xl font-bold uppercase text-[10px]">
                                                    {a.targetType || 'General'}
                                                </span>
                                                <span className="flex items-center gap-2 text-slate-500 font-semibold">
                                                    <Eye className="w-4 h-4" />{Math.floor(Math.random() * 1000)} Views
                                                </span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-200">
                                            <p className="text-slate-400 font-medium">No announcements found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            {/* Gym Details Modal */}
            {selectedGym && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedGym(null)}></div>
                    <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black shadow-inner">
                                    {selectedGym.gym.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black">{selectedGym.gym.name}</h2>
                                    <p className="text-white/80 text-sm font-medium flex items-center gap-2">
                                        <Award className="w-4 h-4" /> {selectedGym.gym.gymType} • {selectedGym.gym.avgRating} Rating
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedGym(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50 font-sans">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Basic Info */}
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-violet-600" /> Basic Information
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Owner</p>
                                                <p className="font-bold text-slate-900">{selectedGym.gym.owner?.name}</p>
                                                <p className="text-sm text-slate-500">{selectedGym.gym.owner?.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Phone</p>
                                                <p className="font-bold text-slate-900 text-sm">{selectedGym.gym.phone}</p>
                                            </div>
                                            <div className="col-span-1 sm:col-span-2">
                                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Address</p>
                                                <p className="text-sm font-bold text-slate-700 leading-relaxed italic">{selectedGym.gym.location?.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Documents */}
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-emerald-600" /> Documents
                                        </h3>
                                        <div className="flex flex-wrap gap-4">
                                            {selectedGym.gym.verificationDocuments?.gstUrl && (
                                                <a href={api.getMediaUrl(selectedGym.gym.verificationDocuments.gstUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 hover:border-violet-500 transition-all group shrink-0">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all"><FileText className="w-4 h-4" /></div>
                                                    <div><p className="text-xs font-bold text-slate-800">GST Certificate</p></div>
                                                </a>
                                            )}
                                            {selectedGym.gym.verificationDocuments?.idProofUrl && (
                                                <a href={api.getMediaUrl(selectedGym.gym.verificationDocuments.idProofUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 hover:border-violet-500 transition-all group shrink-0">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all"><Shield className="w-4 h-4" /></div>
                                                    <div><p className="text-xs font-bold text-slate-800">ID Proof</p></div>
                                                </a>
                                            )}
                                            {selectedGym.gym.verificationDocuments?.certificationUrl && (
                                                <a href={api.getMediaUrl(selectedGym.gym.verificationDocuments.certificationUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 hover:border-violet-500 transition-all group shrink-0">
                                                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all"><Award className="w-4 h-4" /></div>
                                                    <div><p className="text-xs font-bold text-slate-800">Certification</p></div>
                                                </a>
                                            )}
                                            {(!selectedGym.gym.verificationDocuments?.gstUrl && !selectedGym.gym.verificationDocuments?.idProofUrl && !selectedGym.gym.verificationDocuments?.certificationUrl) && (
                                                <p className="text-slate-400 italic text-sm">No specific documents found</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Photos */}
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <Eye className="w-5 h-5 text-indigo-600" /> Gym Photos
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {selectedGym.gym.media?.frontPhotoUrl && (
                                                <div className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                                                    <img src={api.getMediaUrl(selectedGym.gym.media.frontPhotoUrl)} alt="Front" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase p-2 text-center">Front Photo</div>
                                                </div>
                                            )}
                                            {selectedGym.gym.media?.receptionPhotoUrl && (
                                                <div className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                                                    <img src={api.getMediaUrl(selectedGym.gym.media.receptionPhotoUrl)} alt="Reception" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase p-2 text-center">Reception</div>
                                                </div>
                                            )}
                                            {selectedGym.gym.media?.workoutFloorPhotoUrl && (
                                                <div className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                                                    <img src={api.getMediaUrl(selectedGym.gym.media.workoutFloorPhotoUrl)} alt="Workout Floor" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase p-2 text-center">Workout Floor</div>
                                                </div>
                                            )}
                                            {selectedGym.gym.media?.logoUrl && (
                                                <div className="group relative rounded-2xl overflow-hidden aspect-square bg-slate-100 border border-slate-200 p-2">
                                                    <img src={api.getMediaUrl(selectedGym.gym.media.logoUrl)} alt="Logo" className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                            {(!selectedGym.gym.media?.frontPhotoUrl && !selectedGym.gym.media?.receptionPhotoUrl && !selectedGym.gym.media?.workoutFloorPhotoUrl) && (
                                                <p className="text-slate-400 italic text-sm col-span-full">No functional photos uploaded</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Revenue Card */}
                                    <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-6 rounded-3xl shadow-lg text-white">
                                        <p className="text-white/80 text-sm font-bold uppercase mb-2">Lifetime Revenue</p>
                                        <p className="text-4xl font-black mb-4">₹{selectedGym.totalRevenue.toLocaleString('en-IN')}</p>
                                        <div className="pt-4 border-t border-white/20">
                                            <div className="flex justify-between items-center text-sm font-bold">
                                                <span>Current Wallet</span>
                                                <span className="bg-white/20 px-3 py-1 rounded-full">₹{selectedGym.gym.owner?.walletBalance?.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Facilities */}
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-amber-500" /> Facilities
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedGym.gym.facilities?.map((f, i) => (
                                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-200 uppercase">{f}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* User Statistics Card */}
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-indigo-600" /> User Statistics
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                                                <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Active</p>
                                                <p className="text-2xl font-black text-emerald-700">{selectedGym.userStats?.active || 0}</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                                                <p className="text-[10px] font-bold text-rose-600 uppercase mb-1">Expired</p>
                                                <p className="text-2xl font-black text-rose-700">{selectedGym.userStats?.expired || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Plan Purchase Distribution */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                    <TrendingUp className="w-7 h-7 text-emerald-600" /> Plan Purchase Distribution
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {selectedGym.userStats?.planBreakdown?.map((item, i) => (
                                        <div key={i} className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-3">
                                                <Award className="w-6 h-6 text-violet-500" />
                                            </div>
                                            <h4 className="font-black text-slate-900 text-sm mb-1">{item.planName}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-3">{item.planType}</p>
                                            <div className="px-4 py-1.5 rounded-full bg-violet-600 text-white text-sm font-black shadow-lg shadow-violet-200">
                                                {item.count} Purchases
                                            </div>
                                        </div>
                                    ))}
                                    {(!selectedGym.userStats?.planBreakdown || selectedGym.userStats.planBreakdown.length === 0) && (
                                        <div className="col-span-full py-10 text-center">
                                            <p className="text-slate-400 font-bold italic">No plan purchases recorded yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Plans section */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                    <Activity className="w-7 h-7 text-violet-600" /> Active Membership Plans
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {selectedGym.plans?.map((plan, i) => (
                                        <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-violet-500 hover:bg-violet-50 transition-all hover:scale-[1.02]">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h4 className="font-black text-slate-900 text-lg mb-1">{plan.name}</h4>
                                                    <span className="text-[10px] font-black bg-white px-2 py-1 rounded-lg border border-slate-100 text-slate-500 uppercase tracking-widest">{plan.planType} Plan</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-violet-600">₹{plan.price}</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/50 p-3 rounded-2xl border border-slate-100/50">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Workout</p>
                                                    <p className="font-black text-slate-800">{plan.duration} hrs</p>
                                                </div>
                                                <div className="bg-white/50 p-3 rounded-2xl border border-slate-100/50">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Validity</p>
                                                    <p className="font-black text-slate-800">{plan.validity} days</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!selectedGym.plans || selectedGym.plans.length === 0) && (
                                        <div className="col-span-full py-20 text-center">
                                            <Dumbbell className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-bold italic text-lg">No membership plans created yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
