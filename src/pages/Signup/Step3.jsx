import React, { useState } from 'react';
import { Dumbbell, Users } from 'lucide-react';

const Step3 = () => {
    const [selected, setSelected] = useState([]);
    const facilities = [
        { icon: Dumbbell, name: 'Cardio Machines' },
        { icon: Dumbbell, name: 'Strength Machines' },
        { icon: Dumbbell, name: 'Free Weights' },
        { icon: Users, name: 'Personal Trainers' },
        { icon: Dumbbell, name: 'Steam / Sauna' },
        { icon: Dumbbell, name: 'Changing Rooms' }
    ];

    const toggle = (i) => {
        setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Facilities Available</h2>
            <p className="text-slate-500 mb-6">Select all the amenities your gym offers.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {facilities.map((facility, i) => (
                    <div key={i} onClick={() => toggle(i)} className={`p-4 rounded-xl border-2 cursor-pointer text-center transition-all transform hover:scale-105 ${selected.includes(i) ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 bg-white'}`}>
                        <facility.icon className={`w-8 h-8 mx-auto mb-2 ${selected.includes(i) ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="text-sm font-bold text-slate-700">{facility.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Step3;
