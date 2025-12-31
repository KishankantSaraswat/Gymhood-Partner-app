import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';

const PlansSection = ({ gym }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        validity: '', // days
        price: '',
        discountPercent: '0',
        description: '',
        planType: 'monthly',
        duration: '1.5', // hours
        features: []
    });

    const fetchPlans = async () => {
        if (!gym?._id) return;
        try {
            const data = await api.get(`/gymdb/plans/gym/${gym._id}`);
            if (data.success) {
                setPlans(data.plans);
            }
        } catch (err) {
            console.error('Error fetching plans:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, [gym?._id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFeaturesChange = (e) => {
        const featuresArray = e.target.value.split(',').map(f => f.trim());
        setFormData(prev => ({ ...prev, features: featuresArray }));
    };

    const openAddModal = () => {
        setEditingPlan(null);
        setFormData({
            name: '',
            validity: '',
            price: '',
            discountPercent: '0',
            description: '',
            planType: 'monthly',
            duration: '1.5',
            features: []
        });
        setIsModalOpen(true);
    };

    const openEditModal = (plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            validity: plan.validity.toString(),
            price: plan.price.toString(),
            discountPercent: plan.discountPercent.toString(),
            description: plan.description || '',
            planType: plan.planType,
            duration: plan.duration.toString(),
            features: Array.isArray(plan.features) ? plan.features : (plan.features?.split(',') || [])
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (planId) => {
        if (!window.confirm('Are you sure you want to deactivate this plan? Users will no longer be able to purchase it.')) return;

        try {
            const data = await api.put(`/gymdb/plans/${planId}`, { isActive: false });
            if (data.success) {
                fetchPlans();
            }
        } catch (err) {
            console.error('Error deleting plan:', err);
            alert(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!gym?._id) return;

        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                validity: Number(formData.validity),
                price: Number(formData.price),
                discountPercent: Number(formData.discountPercent),
                duration: Number(formData.duration),
                features: formData.features.join(', ')
            };

            let data;
            if (editingPlan) {
                data = await api.put(`/gymdb/plans/${editingPlan._id}`, payload);
            } else {
                data = await api.post(`/gymdb/${gym._id}/plans`, payload);
            }

            if (data.success) {
                setIsModalOpen(false);
                fetchPlans();
                // Reset form
                setFormData({
                    name: '',
                    validity: '',
                    price: '',
                    discountPercent: '0',
                    description: '',
                    planType: 'monthly',
                    duration: '1.5',
                    features: []
                });
                setEditingPlan(null);
            }
        } catch (err) {
            console.error('Error saving plan:', err);
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-900">Membership Plans</h2>
                <button
                    onClick={openAddModal}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200 active:scale-95"
                >
                    <i className="fas fa-plus"></i>
                    Add New Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!Array.isArray(plans) || plans.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-tags text-slate-300 text-2xl"></i>
                        </div>
                        <p className="text-slate-400 font-bold">No active plans found</p>
                        <button onClick={openAddModal} className="mt-4 text-indigo-600 font-bold hover:underline">
                            Create your first plan
                        </button>
                    </div>
                ) : (
                    plans.map((plan) => (
                        <div key={plan._id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all border-b-4 border-b-indigo-500">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-1">{plan.name}</h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                                        {plan.planType}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-slate-900 tracking-tight">₹{plan.price || 0}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{plan.validity || 0} Days</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                {(Array.isArray(plan.features) ? plan.features : (plan.features?.split(',') || [])).map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                                            <i className="fas fa-check text-[10px]"></i>
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium pt-2 border-t border-slate-50">
                                    <i className="fas fa-clock text-indigo-400 w-5"></i>
                                    {plan.duration || 0} Hours duration
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => openEditModal(plan)}
                                    className="flex-1 bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(plan._id)}
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create/Edit Plan Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up">
                        <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
                                <p className="text-indigo-100 text-sm opacity-80 font-medium">
                                    {editingPlan ? `Updating ${editingPlan.name}` : 'Add a new membership options for your gym'}
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Plan Name</label>
                                <input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                                    placeholder="e.g. Monthly Premium"
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Plan Type</label>
                                <select
                                    name="planType"
                                    value={formData.planType}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold appearance-none"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Price (₹)</label>
                                <input
                                    required
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Validity (Days)</label>
                                <input
                                    required
                                    type="number"
                                    name="validity"
                                    value={formData.validity}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                                    placeholder="30"
                                    disabled={!!editingPlan} // Backend suggests validity shouldn't be changed after creation
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Workout Duration (Hrs)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.5"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                                    placeholder="1.5"
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Discount (%)</label>
                                <input
                                    type="number"
                                    name="discountPercent"
                                    value={formData.discountPercent}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                                    placeholder="0"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Features (Comma separated)</label>
                                <input
                                    value={formData.features.join(', ')}
                                    onChange={handleFeaturesChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                                    placeholder="Cardio, Weights, Locker, Sauna"
                                />
                            </div>

                            <div className="col-span-2 mt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black tracking-wider hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {submitting ? (
                                        <i className="fas fa-spinner animate-spin"></i>
                                    ) : (
                                        <i className="fas fa-check-circle"></i>
                                    )}
                                    {editingPlan ? 'SAVE CHANGES' : 'CONFIRM & CREATE PLAN'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlansSection;
