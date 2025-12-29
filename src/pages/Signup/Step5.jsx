import React, { useState } from 'react';
import { Upload, Shield, FileText, Check } from 'lucide-react';

const Step5 = ({ data, updateData }) => {
    const [uploading, setUploading] = useState({});

    const handleFileChange = (id, file) => {
        if (!file) return;

        setUploading(prev => ({ ...prev, [id]: true }));

        // Simulate upload
        setTimeout(() => {
            const dummyUrl = `https://mock-storage.com/${id}-${Date.now()}.pdf`;
            updateData({ documents: { ...data.documents, [id]: dummyUrl } });
            setUploading(prev => ({ ...prev, [id]: false }));
            console.log(`✅ Uploaded Doc ${id}:`, dummyUrl);
        }, 1500);
    };

    const docFields = [
        { id: 'gstUrl', label: 'Business Registration / GST', desc: 'Proof of business ownership' },
        { id: 'idProofUrl', label: 'Owner ID Proof', desc: 'Aadhar Card, PAN, or Passport' },
        { id: 'certificationUrl', label: 'Gym Certification', desc: 'Trade license or safety certificate' }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Documents Required</h2>
            <p className="text-slate-500 mb-6">Verify your business to get the "Verified Partner" badge.</p>
            {docFields.map((field) => (
                <div key={field.id} className="relative">
                    <div className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between
                        ${data.documents?.[field.id] ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-indigo-200'}
                    `}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                                ${data.documents?.[field.id] ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}
                            `}>
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">{field.label}</h4>
                                <p className="text-xs text-slate-500">{field.desc}</p>
                            </div>
                        </div>

                        <div>
                            {data.documents?.[field.id] ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-bold">
                                        <Check className="w-3 h-3" /> Verified
                                    </div>
                                    <label className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-bold text-sm">
                                        Change
                                        <input type="file" className="hidden" accept=".pdf,.doc,.docx,image/*" onChange={(e) => handleFileChange(field.id, e.target.files[0])} />
                                    </label>
                                </div>
                            ) : (
                                <label className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2
                                    ${uploading[field.id] ? 'bg-indigo-100 text-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'}
                                `}>
                                    {uploading[field.id] ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-indigo-400 border-t-indigo-600 rounded-full animate-spin"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" /> Upload Doc
                                        </>
                                    )}
                                    <input type="file" className="hidden" accept=".pdf,.doc,.docx,image/*" disabled={uploading[field.id]} onChange={(e) => handleFileChange(field.id, e.target.files[0])} />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3 mt-8">
                <Shield className="w-5 h-5 text-yellow-600 shrink-0" />
                <p className="text-xs text-yellow-800 leading-relaxed font-medium">
                    Your documents are stored securely and encrypted. Our verification team will review them within 24-48 hours of submission.
                </p>
            </div>
        </div>
    );
};

export default Step5;
