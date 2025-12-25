import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const RevenueSection = () => {
    const revenueChartRef = useRef(null);
    const planChartRef = useRef(null);
    const revenueChartInstance = useRef(null);
    const planChartInstance = useRef(null);

    useEffect(() => {
        if (revenueChartRef.current) {
            const ctx = revenueChartRef.current.getContext('2d');
            if (revenueChartInstance.current) revenueChartInstance.current.destroy();
            revenueChartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Revenue (₹)',
                        data: [120000, 150000, 180000, 200000, 220000, 250000, 300000, 320000, 350000, 380000, 400000, 420000],
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }

        if (planChartRef.current) {
            const ctx = planChartRef.current.getContext('2d');
            if (planChartInstance.current) planChartInstance.current.destroy();
            planChartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Monthly', 'Quarterly', 'Yearly', 'Daily Pass'],
                    datasets: [{
                        data: [45, 25, 20, 10],
                        backgroundColor: ['#4f46e5', '#8b5cf6', '#ec4899', '#f97316']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }

        return () => {
            if (revenueChartInstance.current) revenueChartInstance.current.destroy();
            if (planChartInstance.current) planChartInstance.current.destroy();
        };
    }, []);

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900">Revenue Overview</h3>
                        <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm text-slate-600 outline-none">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div style={{ height: '300px' }}>
                        <canvas ref={revenueChartRef}></canvas>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Revenue by Plan</h3>
                    <div style={{ height: '250px' }}>
                        <canvas ref={planChartRef}></canvas>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900">Transaction History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium">Transaction ID</th>
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Plan</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Amount</th>
                                <th className="p-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                            <tr>
                                <td className="p-4 font-mono text-slate-500">#TRX-8901</td>
                                <td className="p-4 font-medium">Rahul Kumar</td>
                                <td className="p-4">Gold Plan (3 Months)</td>
                                <td className="p-4">Dec 01, 2025</td>
                                <td className="p-4 font-bold">₹4,500</td>
                                <td className="p-4">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Success</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-slate-500">#TRX-8902</td>
                                <td className="p-4 font-medium">Sneha Reddy</td>
                                <td className="p-4">Monthly Access</td>
                                <td className="p-4">Nov 30, 2025</td>
                                <td className="p-4 font-bold">₹1,500</td>
                                <td className="p-4">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Success</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-slate-500">#TRX-8903</td>
                                <td className="p-4 font-medium">Arjun Singh</td>
                                <td className="p-4">Yearly Membership</td>
                                <td className="p-4">Nov 28, 2025</td>
                                <td className="p-4 font-bold">₹12,000</td>
                                <td className="p-4">
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">Pending</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RevenueSection;
