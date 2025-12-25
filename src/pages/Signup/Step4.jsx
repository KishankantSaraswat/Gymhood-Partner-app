import React from 'react';
import { Camera, Upload } from 'lucide-react';

const Step4 = () => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Photos Upload</h2>
        <p className="text-slate-500 mb-6">Upload high-quality images to attract more customers.</p>
        <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Gym Front Photo</h3>
                <p className="text-sm text-slate-500">Drag & drop or click to upload</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Reception Area', 'Workout Floor', 'Locker Room', 'Trainer Team'].map((area, i) => (
                    <div key={i} className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition-all cursor-pointer transform hover:scale-105">
                        <Camera className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-700">{area}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default Step4;
