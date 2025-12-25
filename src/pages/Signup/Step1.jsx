import React from 'react';

const Step1 = () => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Basic Gym Information</h2>
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gym Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. Iron Paradise Fitness" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Owner / Manager Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Full Name" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Business Email</label>
                    <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="gym@business.com" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number</label>
                    <input type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="+91 98765 43210" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Alternate Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <input type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="+91" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Gym Address</label>
                <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Street, Area, City, Pincode"></textarea>
            </div>
        </div>
    </div>
);

export default Step1;
