import React from 'react';
import { Upload, Shield } from 'lucide-react';

const Step5 = () => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Documents Required</h2>
        <p className="text-slate-500 mb-6">Verify your business to get the "Verified Partner" badge.</p>
        <div className="space-y-4">
            {[
                { title: 'Business Registration / GST', subtitle: 'If available' },
                { title: 'Owner ID Proof', subtitle: 'Aadhaar / PAN / Driving License' },
                { title: 'Gym Certification', subtitle: 'Optional' }
            ].map((doc, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Upload className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{doc.title}</h4>
                            <p className="text-xs text-slate-500">{doc.subtitle}</p>
                        </div>
                    </div>
                    <button className="text-indigo-600 font-bold text-sm hover:underline">Upload</button>
                </div>
            ))}
        </div>
        <div className="mt-8 bg-indigo-50 rounded-xl p-4 flex gap-3">
            <Shield className="w-5 h-5 text-indigo-600 mt-1" />
            <div>
                <p className="font-medium text-slate-900">Documents are stored securely.</p>
                <p className="text-sm text-slate-600">We use industry standard measures to protect your data.</p>
            </div>
        </div>
    </div>
);

export default Step5;
