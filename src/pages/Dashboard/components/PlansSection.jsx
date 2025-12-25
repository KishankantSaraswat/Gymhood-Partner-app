import React, { useState } from 'react';

const PlansSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        gym: 'Arabian gym',
        name: '',
        startDate: '',
        endDate: '',
        price: '',
        discount: '',
        features: '',
        planType: '',
        isTrainerIncluded: false,
        workoutDuration: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        setIsModalOpen(false);
        // Reset form
        setFormData({
            gym: 'Arabian gym',
            name: '',
            startDate: '',
            endDate: '',
            price: '',
            discount: '',
            features: '',
            planType: '',
            isTrainerIncluded: false,
            workoutDuration: ''
        });
    };

    return (
        <div className="bg-slate-50 p-4 sm:p-6">
            {!isModalOpen ? (
                <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">Membership Plans</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 w-full sm:w-auto justify-center active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Plan
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 relative overflow-hidden group hover:border-indigo-300 transition-all hover:shadow-lg">
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                Active
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Monthly Access</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-2xl sm:text-3xl font-bold text-indigo-600">₹1,500</span>
                                <span className="text-slate-500 text-sm">/month</span>
                            </div>
                            <ul className="space-y-2 mb-6 text-sm text-slate-600">
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Full Gym Access
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Cardio & Weights
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Locker Access
                                </li>
                            </ul>
                            <div className="flex gap-2 sm:gap-3">
                                <button className="flex-1 bg-slate-50 text-slate-700 py-2.5 sm:py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors active:scale-95">
                                    Edit
                                </button>
                                <button className="w-10 h-10 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors active:scale-95">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden group hover:border-indigo-300 transition-all">
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                Active
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Quarterly Gold</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-bold text-indigo-600">₹4,500</span>
                                <span className="text-slate-500 text-sm">/3 months</span>
                            </div>
                            <ul className="space-y-2 mb-6 text-sm text-slate-600">
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    All Monthly Features
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    1 Personal Session
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Diet Consultation
                                </li>
                            </ul>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-slate-50 text-slate-700 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors">
                                    Edit
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="border-2 border-dashed border-slate-300 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all h-full min-h-[220px] sm:min-h-[250px] active:scale-95"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="font-bold">Create New Plan</span>
                        </button>
                    </div>
                </>
            ) : (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
                    <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col animate-slide-up">
                        <div className="bg-indigo-900 text-white p-4 flex items-center gap-3 rounded-t-2xl sm:rounded-t-2xl sticky top-0 z-10">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-white hover:bg-indigo-800 rounded-lg p-1 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h2 className="text-lg font-bold">Create Plan</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Select Gym
                                </label>
                                <select
                                    name="gym"
                                    value={formData.gym}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border-b-2 border-slate-300 focus:border-indigo-600 outline-none bg-transparent"
                                >
                                    <option>Arabian gym</option>
                                    <option>Fitness Center</option>
                                    <option>Power Gym</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2.5 sm:py-2 border-b-2 border-slate-300 focus:border-indigo-600 outline-none text-base"
                                    placeholder="Enter plan name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Validity Period
                                </label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-slate-600 mb-1">Start Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border-b-2 border-slate-300 focus:border-indigo-600 outline-none"
                                            />
                                        </div>
                                        {!formData.startDate && (
                                            <p className="text-xs text-slate-400 mt-1">No date selected</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-600 mb-1">End Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border-b-2 border-slate-300 focus:border-indigo-600 outline-none"
                                            />
                                        </div>
                                        {!formData.endDate && (
                                            <p className="text-xs text-slate-400 mt-1">No date selected</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border-b-2 border-slate-300 focus:border-indigo-600 outline-none"
                                    placeholder="Enter price"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Discount (%)
                                </label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border-b-2 border-slate-300 focus:border-indigo-600 outline-none"
                                    placeholder="Enter discount percentage"
                                    min="0"
                                    max="100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Features
                                </label>
                                <input
                                    type="text"
                                    name="features"
                                    value={formData.features}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border-b-2 border-slate-300 focus:border-indigo-600 outline-none"
                                    placeholder="Enter features"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Plan Type
                                </label>
                                <select
                                    name="planType"
                                    value={formData.planType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border-b-2 border-slate-300 focus:border-indigo-600 outline-none bg-transparent"
                                >
                                    <option value="">Select plan type</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="halfyearly">Half Yearly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Is Trainer Included?
                                </label>
                                <label className="relative inline-block w-12 h-6 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isTrainerIncluded"
                                        checked={formData.isTrainerIncluded}
                                        onChange={handleInputChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-12 h-6 bg-slate-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow"></div>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Workout Duration
                                </label>
                                <select
                                    name="workoutDuration"
                                    value={formData.workoutDuration}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border-b-2 border-slate-300 focus:border-indigo-600 outline-none bg-transparent"
                                >
                                    <option value="">Select duration</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">60 minutes</option>
                                    <option value="90">90 minutes</option>
                                    <option value="120">120 minutes</option>
                                </select>
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-indigo-900 text-white py-3.5 sm:py-3 rounded-xl font-bold hover:bg-indigo-800 transition-colors mt-4 sm:mt-6 active:scale-95 text-base"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlansSection;