import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import GymLoader from '../../../components/GymLoader';

const PaymentHistorySection = ({ gym }) => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                setLoading(true);
                // Fetch wallet balance
                const balanceRes = await api.get(`/payment/gym-balance/${gym._id}`);
                if (balanceRes.success) {
                    setBalance(balanceRes.data.balance);
                }

                // Fetch transactions
                const transactionsRes = await api.get('/gymdb/api/transactions');
                if (transactionsRes.success) {
                    // Filter transactions related to this gym if necessary, 
                    // but the backend might already be doing that for the owner.
                    // Looking at the controller, it returns transactions for the userId.
                    setTransactions(transactionsRes.data);
                }
            } catch (err) {
                console.error('Error fetching payment data:', err);
                setError('Failed to load payment information.');
            } finally {
                setLoading(false);
            }
        };

        if (gym?._id) {
            fetchPaymentData();
        }
    }, [gym?._id]);

    const filteredTransactions = transactions.filter(txn => {
        if (filterType === 'All') return true;
        return txn.type === filterType;
    });

    const handleWhatsAppSettlement = () => {
        const phoneNumber = "6006103711";
        const message = `I need settlement and my gym id is ${gym._id}`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleMailSettlement = () => {
        const ownerName = JSON.parse(localStorage.getItem('user'))?.name || 'Gym Owner';
        const subject = `settlement request-GynHood Partner`;
        const body = `Dear Support Team,\n\ni would like to request the settle ment of my gyHood Partner account \naccount details\nGymid: ${gym._id}\nplease process my settlement req\nthankyou\nbest regards,\n${ownerName}`;
        window.location.href = `mailto:support@gymshood.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <GymLoader text="Loading payment history..." />
        </div>
    );

    if (error) return (
        <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 text-center">
            <i className="fas fa-exclamation-circle text-3xl mb-3"></i>
            <p className="font-bold">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300">
                    <div>
                        <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Total Balance</p>
                        <h2 className="text-4xl font-black text-slate-900">₹{balance.toLocaleString()}</h2>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-emerald-500 bg-emerald-50 w-fit px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight">
                        <i className="fas fa-wallet"></i>
                        <span>Wallet Balance</span>
                    </div>
                </div>

                {/* Settlement Actions */}
                <div className="md:col-span-2 bg-indigo-600 p-8 rounded-[2rem] shadow-indigo-100 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>

                    <div className="relative z-10 text-center sm:text-left">
                        <h3 className="text-2xl font-black text-white mb-2">Request Settlement</h3>
                        <p className="text-indigo-100 font-medium">Withdraw your earnings directly to your account</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full sm:w-auto">
                        <button
                            onClick={handleWhatsAppSettlement}
                            className="bg-[#25D366] text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-200"
                        >
                            <i className="fab fa-whatsapp text-lg"></i>
                            WhatsApp
                        </button>
                        <button
                            onClick={handleMailSettlement}
                            className="bg-white text-indigo-600 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            <i className="fas fa-envelope text-lg"></i>
                            Mail Admin
                        </button>
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">Transaction History</h3>
                        <p className="text-slate-400 text-sm font-medium">View all your recent wallet activities</p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl">
                        {['All', 'Credit', 'Debit'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterType === type
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((txn, idx) => (
                                    <tr key={txn._id || idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${txn.type === 'Credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    <i className={`fas ${txn.type === 'Credit' ? 'fa-arrow-down' : 'fa-arrow-up'} text-sm`}></i>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{txn.reason || 'Wallet Transaction'}</p>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">ID: {txn.razorpayOrderId || txn._id?.substring(0, 12)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-600">
                                                {new Date(txn.createdAt).toLocaleDateString(undefined, {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                {new Date(txn.createdAt).toLocaleTimeString(undefined, {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${txn.type === 'Credit'
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-red-50 text-red-600 border border-red-100'
                                                }`}>
                                                {txn.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className={`text-lg font-black ${txn.type === 'Credit' ? 'text-emerald-600' : 'text-slate-900'
                                                }`}>
                                                {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                            </p>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${txn.status === 'Completed' ? 'text-slate-400' : 'text-amber-500'
                                                }`}>
                                                {txn.status}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                                <i className="fas fa-receipt text-2xl"></i>
                                            </div>
                                            <p className="text-slate-400 font-bold">No transactions found matching your filter</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistorySection;
