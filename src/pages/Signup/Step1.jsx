import React from 'react';

const Step1 = ({ data, updateData }) => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Basic Gym Information</h2>
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gym Name</label>
                <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Iron Paradise Fitness"
                    value={data.name}
                    onChange={(e) => updateData({ name: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Owner / Manager Name <span className="text-indigo-600">(Your Account Name)</span></label>
                    <input
                        required
                        type="text"
                        className="w-full px-4 py-3 bg-white border-2 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                        placeholder="e.g. Anoop Kumar"
                        value={data.ownerName}
                        onChange={(e) => updateData({ ownerName: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Account Email <span className="text-indigo-600">(Used for Login)</span></label>
                    <input
                        required
                        type="email"
                        className="w-full px-4 py-3 bg-white border-2 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                        placeholder="name@business.com"
                        value={data.email}
                        onChange={(e) => updateData({ email: e.target.value })}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Login Password <span className="text-slate-400 font-normal">(6-15 chars)</span></label>
                    <input
                        required
                        type="password"
                        className="w-full px-4 py-3 bg-white border-2 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                        placeholder="••••••••"
                        minLength={6}
                        maxLength={15}
                        value={data.password}
                        onChange={(e) => updateData({ password: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Account phone <span className="text-slate-400 font-normal">(10 digits)</span></label>
                    <input
                        required
                        type="tel"
                        pattern="[0-9]*"
                        className="w-full px-4 py-3 bg-white border-2 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                        placeholder="9876543210"
                        value={data.phone}
                        onChange={(e) => updateData({ phone: e.target.value.replace(/\D/g, '') })}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Gym Slogan</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="e.g. Get fit with us"
                        value={data.gymSlogan}
                        onChange={(e) => updateData({ gymSlogan: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Alternate Phone <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <input
                        type="tel"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="+91"
                        value={data.alternatePhone}
                        onChange={(e) => updateData({ alternatePhone: e.target.value })}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Capacity</label>
                    <input
                        type="number"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="e.g. 50"
                        value={data.capacity}
                        onChange={(e) => updateData({ capacity: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Open Time</label>
                    <input
                        type="time"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={data.openTime}
                        onChange={(e) => updateData({ openTime: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Close Time</label>
                    <input
                        type="time"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={data.closeTime}
                        onChange={(e) => updateData({ closeTime: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Gym Address</label>
                <textarea
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Street, Area, City, Pincode"
                    value={data.address}
                    onChange={(e) => updateData({ address: e.target.value })}
                ></textarea>
            </div>
        </div>
    </div>
);

export default Step1;
