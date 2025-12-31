import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';

const GymProfile = ({ gym }) => {
    const [gymData, setGymData] = useState(gym || {});
    const [loading, setLoading] = useState(!gym);
    const [saving, setSaving] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [isEditingShifts, setIsEditingShifts] = useState(false);
    const [editedShifts, setEditedShifts] = useState([]);
    const [isEditingPhotos, setIsEditingPhotos] = useState(false);
    const [uploadingPhotos, setUploadingPhotos] = useState({});

    const [isEditingEquipment, setIsEditingEquipment] = useState(false);
    const [editedEquipment, setEditedEquipment] = useState([]);

    useEffect(() => {
        const fetchGymAndRatings = async () => {
            try {
                let currentGym = gym;
                if (!currentGym) {
                    const data = await api.get('/gymdb/gym/owner/me');
                    if (data.success && data.gyms.length > 0) {
                        currentGym = data.gyms[0];
                        setGymData(currentGym);
                    }
                }

                if (currentGym?._id) {
                    setLoadingReviews(true);
                    const ratingsData = await api.get(`/gymdb/ratings/gym/${currentGym._id}`);
                    if (ratingsData.success) {
                        setReviews(ratingsData.ratings);
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
                setLoadingReviews(false);
            }
        };
        fetchGymAndRatings();
    }, [gym]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'location') {
            setGymData(prev => ({
                ...prev,
                location: { ...prev.location, address: value }
            }));
        } else {
            setGymData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async (updatedData = gymData) => {
        setSaving(true);
        try {
            // Filter only allowed fields to prevent "Invalid updates" error from backend
            const allowedFields = [
                'name', 'capacity', 'openTime', 'closeTime',
                'contactEmail', 'phone', 'alternatePhone', 'about',
                'shifts', 'gymSlogan', 'equipmentList', 'gymType',
                'facilities', 'onboardingStep', 'onboardingStatus',
                'pincode', 'location'
            ];

            const filteredData = {};
            allowedFields.forEach(field => {
                if (updatedData[field] !== undefined) {
                    filteredData[field] = updatedData[field];
                }
            });

            // Clean shifts of _id and __v if they exist
            if (filteredData.shifts) {
                filteredData.shifts = filteredData.shifts.map(({ _id, __v, ...rest }) => rest);
            }

            const response = await api.put(`/gymdb/gym/${gymData._id}`, filteredData);
            if (response.success) {
                setGymData(response.gym);
                alert('Profile updated successfully!');
            }
        } catch (err) {
            console.error('Save failed:', err);
            alert(err.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const toggleShiftEdit = () => {
        setEditedShifts(gymData.shifts || []);
        setIsEditingShifts(!isEditingShifts);
    };

    const handleShiftChange = (index, field, value) => {
        const newShifts = [...editedShifts];
        newShifts[index] = { ...newShifts[index], [field]: value };
        setEditedShifts(newShifts);
    };

    const saveShifts = async () => {
        const cleanShifts = editedShifts.map(({ day, name, startTime, endTime, gender, capacity }) => ({
            day, name, startTime, endTime, gender, capacity: Number(capacity) || 0
        }));
        await handleSave({ ...gymData, shifts: cleanShifts });
        setIsEditingShifts(false);
    };

    const addShift = () => {
        setEditedShifts([...editedShifts, { day: 'Monday', name: 'Morning', startTime: '06:00', endTime: '10:00', gender: 'unisex', capacity: 20 }]);
    };

    const removeShift = (index) => {
        setEditedShifts(editedShifts.filter((_, i) => i !== index));
    };

    const toggleEquipmentEdit = () => {
        setEditedEquipment(gymData.equipmentList || []);
        setIsEditingEquipment(!isEditingEquipment);
    };

    const handleEquipmentChange = (index, value) => {
        const newEquipment = [...editedEquipment];
        newEquipment[index] = value;
        setEditedEquipment(newEquipment);
    };

    const addEquipmentItem = () => {
        setEditedEquipment([...editedEquipment, '']);
    };

    const removeEquipmentItem = (index) => {
        setEditedEquipment(editedEquipment.filter((_, i) => i !== index));
    };

    const saveEquipment = async () => {
        const cleanEquipment = editedEquipment.filter(item => item && item.trim() !== '');
        await handleSave({ ...gymData, equipmentList: cleanEquipment });
        setIsEditingEquipment(false);
    };

    const handlePhotoUpload = async (field, file) => {
        if (!file) return;
        setUploadingPhotos(prev => ({ ...prev, [field]: true }));
        try {
            const uploadRes = await api.upload(file);
            if (uploadRes.success) {
                const newMedia = {
                    ...gymData.media,
                    [field]: uploadRes.url
                };

                delete newMedia._id;
                delete newMedia.__v;

                const response = await api.post(`/gymdb/gym/${gymData._id}/media`, newMedia);
                if (response.success) {
                    setGymData(prev => ({ ...prev, media: response.media }));
                }
            }
        } catch (err) {
            console.error('Photo upload failed:', err);
            alert('Photo upload failed. Please check if file server is running.');
        } finally {
            setUploadingPhotos(prev => ({ ...prev, [field]: false }));
        }
    };

    const photoCategories = [
        { id: 'frontPhotoUrl', label: 'Main Front Photo' },
        { id: 'receptionPhotoUrl', label: 'Reception Area' },
        { id: 'workoutFloorPhotoUrl', label: 'Workout Floor' },
        { id: 'lockerRoomPhotoUrl', label: 'Locker Rooms' },
        { id: 'trainerTeamPhotoUrl', label: 'Trainer/Team Photo' }
    ];

    if (loading) return <div className="p-20 text-center">Loading...</div>;

    const mainImageUrl = api.getMediaUrl(gymData.media?.logoUrl || gymData.media?.frontPhotoUrl) ||
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

    const coverImageUrl = api.getMediaUrl(gymData.media?.frontPhotoUrl || gymData.media?.mediaUrls?.[0]);

    const galleryPhotos = [
        { url: gymData.media?.frontPhotoUrl, label: 'Front' },
        { url: gymData.media?.receptionPhotoUrl, label: 'Reception' },
        { url: gymData.media?.workoutFloorPhotoUrl, label: 'Workout Floor' },
        { url: gymData.media?.lockerRoomPhotoUrl, label: 'Locker Room' },
        { url: gymData.media?.trainerTeamPhotoUrl, label: 'Trainer Team' },
        ...(gymData.media?.mediaUrls?.map(url => ({ url, label: 'Extra' })) || [])
    ].filter(p => p.url).map(p => ({ ...p, url: api.getMediaUrl(p.url) }));

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="h-48 sm:h-64 bg-slate-900 relative">
                        {coverImageUrl ? (
                            <img src={coverImageUrl} className="w-full h-full object-cover opacity-60" alt="Cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 opacity-80" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase">{gymData.name}</h1>
                        </div>
                    </div>

                    <div className="px-8 pb-10">
                        <div className="relative -mt-16 sm:-mt-20 mb-8 flex justify-between items-end">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-indigo-50 p-1.5 shadow-2xl shadow-indigo-500/20 border-4 border-white overflow-hidden">
                                <img
                                    src={mainImageUrl}
                                    className="w-full h-full object-cover rounded-[2rem]"
                                    alt="Gym logo"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleSave()}
                                    disabled={saving}
                                    className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? 'SAVING...' : 'SAVE CHANGES'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Gym Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={gymData.name || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contact Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        maxLength={10}
                                        value={gymData.phone || ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            handleInputChange({ target: { name: 'phone', value: val } });
                                        }}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 shadow-inner"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            maxLength={6}
                                            value={gymData.pincode || ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                handleInputChange({ target: { name: 'pincode', value: val } });
                                            }}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 shadow-inner"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                                        <div className="w-full px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-center text-xs tracking-widest border border-emerald-100 uppercase">
                                            {gymData.isVerified ? 'VERIFIED ✓' : 'PENDING ⋯'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Address</label>
                                    <textarea
                                        rows="4"
                                        name="location"
                                        value={gymData.location?.address || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 shadow-inner resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Top Facilities</label>
                                    <div className="flex flex-wrap gap-2">
                                        {gymData.facilities?.length > 0 ? (
                                            gymData.facilities.map((f, i) => (
                                                <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                                                    {f}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-slate-400 font-bold italic">No facilities listed</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sm:p-10">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">
                            <i className="fas fa-info-circle"></i>
                        </div>
                        About Gym shood
                    </h2>
                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Description</label>
                            <p className="p-6 bg-slate-50 rounded-3xl text-slate-600 font-medium leading-relaxed border border-slate-100">
                                {gymData.description || "The best gym, Spa, Massage with world-class facilities and expert trainers."}
                            </p>
                        </div>

                        <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full -mr-32 -mt-32" />
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 relative z-10">
                                <h3 className="font-black text-2xl flex items-center gap-4 tracking-tight">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    Operating Shifts
                                </h3>
                                <button
                                    onClick={toggleShiftEdit}
                                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-black text-xs tracking-widest transition-all border border-white/10 active:scale-95 flex items-center gap-2 uppercase"
                                >
                                    <i className="fas fa-cog"></i>
                                    Manage Shifts
                                </button>
                            </div>

                            {gymData.shifts?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                                    {gymData.shifts.map((shift, idx) => (
                                        <div key={idx} className="bg-white/5 p-6 rounded-[2rem] border border-white/10 hover:border-indigo-500/50 transition-all group overflow-hidden relative">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <i className={`fas ${shift.name?.toLowerCase().includes('morning') ? 'fa-sun' : 'fa-moon'} text-4xl`}></i>
                                            </div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                    {shift.day}
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${shift.gender === 'male' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    shift.gender === 'female' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    }`}>
                                                    {shift.gender === 'male' ? 'Men Only' : shift.gender === 'female' ? 'Women Only' : 'Unisex'}
                                                </span>
                                            </div>
                                            <p className="text-2xl font-black tracking-tighter mb-1 text-white group-hover:text-indigo-300 transition-colors uppercase">
                                                {shift.startTime} <span className="text-white/30 text-lg mx-1">→</span> {shift.endTime}
                                            </p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                {shift.name || 'General Shift'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-[2.5rem] relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-white/20">
                                        <i className="fas fa-calendar-times text-2xl"></i>
                                    </div>
                                    <p className="text-slate-500 font-bold mb-6 italic text-sm">No shifts configured for your gym</p>
                                    <button
                                        onClick={toggleShiftEdit}
                                        className="bg-indigo-600 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/40"
                                    >
                                        Add First Shift
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-3">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gym Equipment</label>
                                <button
                                    onClick={toggleEquipmentEdit}
                                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider flex items-center gap-1"
                                >
                                    <i className="fas fa-edit"></i> Edit
                                </button>
                            </div>
                            {gymData.equipmentList?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {gymData.equipmentList.map((eq, i) => (
                                        <span key={i} className="px-5 py-3 bg-white border border-slate-100 text-slate-700 rounded-2xl text-[11px] font-bold shadow-sm">
                                            {eq}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                                    <p className="text-slate-400 font-bold mb-4 italic text-sm">No equipment listed yet</p>
                                    <button
                                        onClick={toggleEquipmentEdit}
                                        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                                    >
                                        ADD EQUIPMENT
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sm:p-10">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">
                                <i className="fas fa-images"></i>
                            </div>
                            Gym Photos
                        </div>
                        <button
                            onClick={() => setIsEditingPhotos(true)}
                            className="text-[10px] font-black bg-slate-900 text-white px-6 py-3 rounded-2xl uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            <i className="fas fa-camera"></i>
                            Manage Photos
                        </button>
                    </h2>

                    {galleryPhotos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {galleryPhotos.map((photo, i) => (
                                <div key={i} className="aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 group relative">
                                    <img src={photo.url} alt={photo.label} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">{photo.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center">
                            <i className="fas fa-camera text-slate-200 text-5xl mb-4"></i>
                            <p className="text-slate-400 font-bold mb-6 italic">Showcase your gym with amazing photos!</p>
                            <button
                                onClick={() => setIsEditingPhotos(true)}
                                className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-200 active:scale-95 uppercase"
                            >
                                Upload First Photo
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sm:p-10">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">
                            <i className="fas fa-star"></i>
                        </div>
                        User Reviews ({reviews.length})
                    </h2>

                    {loadingReviews ? (
                        <div className="text-center py-10 text-slate-400 font-bold italic">Loading reviews...</div>
                    ) : reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((review, i) => (
                                <div key={review.id || i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                                                {review.user?.profile_picture ? (
                                                    <img src={review.user.profile_picture} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-black text-slate-400">{review.user?.name?.[0] || 'U'}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{review.user?.name || "Anonymous Member"}</p>
                                                <div className="flex gap-0.5 text-amber-400 text-[10px]">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i key={i} className={`${i < review.rating ? 'fas' : 'far'} fa-star`}></i>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-bold">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                        "{review.feedback || review.comment || "No feedback provided"}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center bg-slate-50 border border-slate-100 rounded-[2.5rem]">
                            <p className="text-slate-400 font-bold italic text-sm">No reviews yet for your gym</p>
                        </div>
                    )}
                </div>
            </div>

            {isEditingShifts && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={toggleShiftEdit} />
                    <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-modal-in">
                        <div className="p-8 sm:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">MANAGE OPERATING SHIFTS</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Configure your gym's daily schedule</p>
                            </div>
                            <button onClick={toggleShiftEdit} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center shadow-sm transition-all">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-8 sm:p-10 overflow-y-auto flex-1 space-y-6">
                            {editedShifts.map((shift, idx) => (
                                <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 relative group">
                                    <button
                                        onClick={() => removeShift(idx)}
                                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-4 gap-y-6">
                                        <div className="lg:col-span-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Day</label>
                                            <select
                                                value={shift.day}
                                                onChange={(e) => handleShiftChange(idx, 'day', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                            >
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="lg:col-span-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Shift Name</label>
                                            <input
                                                type="text"
                                                value={shift.name}
                                                placeholder="e.g. Morning"
                                                onChange={(e) => handleShiftChange(idx, 'name', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="lg:col-span-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Start Time</label>
                                            <div className="relative">
                                                <input
                                                    type="time"
                                                    value={shift.startTime}
                                                    onChange={(e) => handleShiftChange(idx, 'startTime', e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="lg:col-span-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">End Time</label>
                                            <div className="relative">
                                                <input
                                                    type="time"
                                                    value={shift.endTime}
                                                    onChange={(e) => handleShiftChange(idx, 'endTime', e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="lg:col-span-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Capacity</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={shift.capacity || ''}
                                                placeholder="Max Users"
                                                onChange={(e) => handleShiftChange(idx, 'capacity', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="lg:col-span-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Gender</label>
                                            <select
                                                value={shift.gender}
                                                onChange={(e) => handleShiftChange(idx, 'gender', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                            >
                                                <option value="unisex">Unisex</option>
                                                <option value="male">Men Only</option>
                                                <option value="female">Women Only</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={addShift}
                                className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-black text-[10px] tracking-widest hover:border-indigo-500 hover:text-indigo-500 transition-all flex items-center justify-center gap-2 uppercase"
                            >
                                <i className="fas fa-plus-circle"></i>
                                Add Another Shift
                            </button>
                        </div>
                        <div className="p-8 sm:p-10 border-t border-slate-100 flex gap-4 bg-slate-50">
                            <button
                                onClick={toggleShiftEdit}
                                className="flex-1 px-8 py-4 rounded-2xl font-black text-xs tracking-widest text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 transition-all uppercase"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveShifts}
                                disabled={saving}
                                className="flex-[2] px-8 py-4 rounded-2xl font-black text-xs tracking-widest text-white bg-slate-900 hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50 uppercase"
                            >
                                {saving ? 'SAVING CHANGES...' : 'SAVE ALL SHIFTS'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditingEquipment && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={toggleEquipmentEdit} />
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-modal-in">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">GYM EQUIPMENT</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">List the equipment available at your gym</p>
                            </div>
                            <button onClick={toggleEquipmentEdit} className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center shadow-sm transition-all">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto flex-1 space-y-4">
                            {editedEquipment.map((item, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={item}
                                        placeholder="e.g. Treadmill, Dumbbells, Bench Press"
                                        onChange={(e) => handleEquipmentChange(idx, e.target.value)}
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        autoFocus={item === ''}
                                    />
                                    <button
                                        onClick={() => removeEquipmentItem(idx)}
                                        className="w-12 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all flex items-center justify-center"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addEquipmentItem}
                                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-[10px] tracking-widest hover:border-indigo-500 hover:text-indigo-500 transition-all flex items-center justify-center gap-2 uppercase"
                            >
                                <i className="fas fa-plus-circle"></i>
                                Add Item
                            </button>
                        </div>
                        <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50">
                            <button
                                onClick={toggleEquipmentEdit}
                                className="flex-1 px-6 py-3.5 rounded-xl font-black text-xs tracking-widest text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 transition-all uppercase"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEquipment}
                                disabled={saving}
                                className="flex-[2] px-6 py-3.5 rounded-xl font-black text-xs tracking-widest text-white bg-slate-900 hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50 uppercase"
                            >
                                {saving ? 'SAVING...' : 'SAVE EQUIPMENT'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditingPhotos && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setIsEditingPhotos(false)} />
                    <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-modal-in">
                        <div className="p-8 sm:p-10 border-b border-slate-100 flex justify-between items-center bg-white">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">PHOTOS UPLOAD</h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-1">Upload high-quality images to attract more customers.</p>
                            </div>
                            <button onClick={() => setIsEditingPhotos(false)} className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-all">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-8 sm:p-10 overflow-y-auto flex-1 bg-slate-50/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {photoCategories.map((cat) => (
                                    <div key={cat.id} className="space-y-4">
                                        <div className="flex justify-between items-center px-2">
                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.1em]">{cat.label}</h4>
                                            {gymData.media?.[cat.id] && (
                                                <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1 uppercase">
                                                    <i className="fas fa-check-circle"></i> Uploaded
                                                </span>
                                            )}
                                        </div>
                                        <div className={`relative h-56 rounded-[2.5rem] border-2 border-dashed transition-all group overflow-hidden bg-white
                                                    ${gymData.media?.[cat.id] ? 'border-emerald-200' : 'border-slate-200 hover:border-indigo-400'}
                                                `}>
                                            {gymData.media?.[cat.id] ? (
                                                <>
                                                    <img src={api.getMediaUrl(gymData.media[cat.id])} alt={cat.label} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <label className="cursor-pointer bg-white text-slate-900 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                                                            Change Photo
                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(cat.id, e.target.files[0])} />
                                                        </label>
                                                    </div>
                                                </>
                                            ) : (
                                                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6">
                                                    {uploadingPhotos[cat.id] ? (
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div className="w-10 h-10 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Uploading...</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="w-14 h-14 rounded-full bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center mb-4 transition-all group-hover:scale-110">
                                                                <i className="fas fa-cloud-upload-alt text-2xl text-slate-300 group-hover:text-indigo-400"></i>
                                                            </div>
                                                            <p className="text-xs font-black text-slate-900 uppercase tracking-widest group-hover:text-indigo-600">Click to upload photo</p>
                                                            <p className="text-[10px] text-slate-400 font-bold mt-2">High resolution JPG or PNG</p>
                                                        </>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/*" disabled={uploadingPhotos[cat.id]} onChange={(e) => handlePhotoUpload(cat.id, e.target.files[0])} />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-8 sm:p-10 border-t border-slate-100 flex justify-end bg-white">
                            <button
                                onClick={() => setIsEditingPhotos(false)}
                                className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95 uppercase"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GymProfile;
