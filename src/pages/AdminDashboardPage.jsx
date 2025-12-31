import React, { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, FileText, Image as ImageIcon,
    User, MapPin, Loader, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAllGyms();
    }, []);

    const fetchAllGyms = async () => {
        try {
            const token = localStorage.getItem('gymshood_token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/gyms/admin-all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setGyms(data.gyms);
            } else {
                setError('Failed to fetch gyms');
            }
        } catch (err) {
            console.error(err);
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyToggle = async (gymId) => {
        try {
            const token = localStorage.getItem('gymshood_token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/gym/${gymId}/toggle-verify`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                // Update local list with new status
                setGyms(gyms.map(g => g._id === gymId ? { ...g, isVerified: data.isVerified } : g));
                alert(data.isVerified ? 'Gym Verified Successfully!' : 'Gym Unverified Successfully!');
            }
        } catch (err) {
            alert('Status update failed');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                        <p className="text-slate-500">Gym Verification Portal</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </header>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                {gyms.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700">No Gyms Found</h3>
                        <p className="text-slate-500">There are no gyms registered in the system yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {gyms.map(gym => (
                            <div key={gym._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Gym Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-800">{gym.name}</h2>
                                                <div className="flex items-center gap-2 text-slate-500 mt-1">
                                                    <MapPin size={16} />
                                                    <span className="text-sm">{gym.location?.address}</span>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${gym.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {gym.isVerified ? 'Verified' : 'Unverified'}
                                            </span>
                                        </div>

                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-3">
                                                <User size={18} /> Owner Details
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="block text-slate-400 text-xs">Name</span>
                                                    <span className="font-medium">{gym.owner?.name}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-slate-400 text-xs">Email</span>
                                                    <span className="font-medium">{gym.owner?.email}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-slate-400 text-xs">Phone</span>
                                                    <span className="font-medium">{gym.phone}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Registration Details */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div className="bg-slate-50 p-3 rounded-lg">
                                                <span className="block text-slate-400 text-xs">Capacity</span>
                                                <span className="font-medium">{gym.capacity}</span>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg">
                                                <span className="block text-slate-400 text-xs">Type</span>
                                                <span className="font-medium capitalize">{gym.gymType}</span>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg">
                                                <span className="block text-slate-400 text-xs">Opening</span>
                                                <span className="font-medium">{gym.openTime} - {gym.closeTime}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Documents & Media */}
                                    <div className="flex-1 lg:max-w-md space-y-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                                        <div>
                                            <h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-3">
                                                <FileText size={18} /> Verification Documents
                                            </h4>
                                            {gym.verificationDocuments ? (
                                                <div className="space-y-2">
                                                    {gym.verificationDocuments.gstUrl && (
                                                        <a href={gym.verificationDocuments.gstUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                                                            <FileText size={16} /> GST Certificate
                                                        </a>
                                                    )}
                                                    {gym.verificationDocuments.idProofUrl && (
                                                        <a href={gym.verificationDocuments.idProofUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                                                            <FileText size={16} /> ID Proof
                                                        </a>
                                                    )}
                                                    {gym.verificationDocuments.certificationUrl && (
                                                        <a href={gym.verificationDocuments.certificationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                                                            <FileText size={16} /> Gym Certificate
                                                        </a>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-400 italic">No documents uploaded yet.</p>
                                            )}
                                        </div>

                                        <div>
                                            <h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-3">
                                                <ImageIcon size={18} /> Photos
                                            </h4>
                                            {gym.media ? (
                                                <div className="flex gap-2 overflow-x-auto pb-2">
                                                    {[gym.media.logoUrl, gym.media.frontPhotoUrl, gym.media.receptionPhotoUrl]
                                                        .filter(Boolean)
                                                        .map((url, i) => (
                                                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                                                                <img src={url} alt="Gym" className="w-full h-full object-cover" />
                                                            </a>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-400 italic">No photos uploaded.</p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleVerifyToggle(gym._id)}
                                            className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-lg text-white
                                                ${gym.isVerified
                                                    ? 'bg-slate-500 hover:bg-slate-600 shadow-slate-200'
                                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                                                }`}
                                        >
                                            {gym.isVerified ? <XCircle size={20} /> : <CheckCircle size={20} />}
                                            {gym.isVerified ? 'Unverify Gym' : 'Verify Gym'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
