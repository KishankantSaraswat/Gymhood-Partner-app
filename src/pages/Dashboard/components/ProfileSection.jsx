import React, { useState } from 'react';

const GymProfile = () => {
    const [photos, setPhotos] = useState([
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ]);

    const [equipment, setEquipment] = useState([
        { id: 1, name: 'Cardio', active: true },
        { id: 2, name: 'Strength', active: true },
        { id: 3, name: 'Core', active: true },
        { id: 4, name: 'Yoga', active: true },
        { id: 5, name: 'Zumba', active: false },
        { id: 6, name: 'Athletics', active: false }
    ]);

    const [reviews, setReviews] = useState([
        { id: 1, name: 'Sarah Johnson', rating: 5, comment: 'Amazing gym with great equipment!', date: '2 days ago' },
        { id: 2, name: 'Mike Peters', rating: 4, comment: 'Good facilities and friendly staff.', date: '1 week ago' }
    ]);

    const [aboutText, setAboutText] = useState('The best gym, Spa, Massage');
    const [operatingHours, setOperatingHours] = useState({ open: '5:00 AM', close: '10:30 PM' });

    const addPhotoSlot = () => {
        setPhotos([...photos, null]);
    };

    const removePhoto = (index) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    const toggleEquipment = (id) => {
        setEquipment(equipment.map(eq =>
            eq.id === id ? { ...eq, active: !eq.active } : eq
        ));
    };

    const addEquipment = () => {
        const newName = prompt('Enter equipment name:');
        if (newName) {
            setEquipment([...equipment, { id: Date.now(), name: newName, active: true }]);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Profile Section */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                        <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-all">
                            Change Cover
                        </button>
                    </div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6 flex justify-between items-end">
                            <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg">
                                <img
                                    src={photos[0] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"}
                                    className="w-full h-full object-cover rounded-xl"
                                    alt="Gym"
                                />
                            </div>
                            <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30">
                                Save Changes
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Gym Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Iron Paradise Fitness"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Owner Name</label>
                                    <input
                                        type="text"
                                        defaultValue="John Doe"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number</label>
                                    <input
                                        type="text"
                                        defaultValue="+91 98765 43210"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                                    <textarea
                                        rows="4"
                                        defaultValue="123, Fitness Street, Koramangala, Bangalore - 560034"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Facilities</label>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">Cardio</span>
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">Weights</span>
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">Steam</span>
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">Parking</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Photos Section */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Photos</h2>
                        <button
                            onClick={addPhotoSlot}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all"
                        >
                            + Add Photo Slot
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.map((photo, index) => (
                            <div key={index} className="relative group aspect-square">
                                {photo ? (
                                    <>
                                        <img
                                            src={photo}
                                            alt={`Gym photo ${index + 1}`}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                        <button
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-slate-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 cursor-pointer hover:border-indigo-500 transition-colors">
                                        <svg className="w-12 h-12 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span className="text-sm text-slate-500">Add Image</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Equipment Section */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Equipment</h2>
                        <button
                            onClick={addEquipment}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all"
                        >
                            + Add Equipment
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {equipment.map(eq => (
                            <button
                                key={eq.id}
                                onClick={() => toggleEquipment(eq.id)}
                                className={`p-6 rounded-xl font-bold text-lg transition-all ${eq.active
                                        ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg'
                                        : 'bg-slate-200 text-slate-500'
                                    }`}
                            >
                                {eq.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Reviews</h2>
                    {reviews.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-20 h-20 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <p className="text-slate-500 text-lg">No reviews yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <div key={review.id} className="border border-slate-200 rounded-xl p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <span className="text-indigo-600 font-bold">{review.name[0]}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">{review.name}</h3>
                                                <p className="text-sm text-slate-500">{review.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* About Section */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">About Us</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea
                                value={aboutText}
                                onChange={(e) => setAboutText(e.target.value)}
                                rows="4"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Tell members about your gym..."
                            />
                        </div>

                        <div className="bg-slate-50 rounded-xl p-6">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Operating Hours
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Open</label>
                                    <input
                                        type="text"
                                        value={operatingHours.open}
                                        onChange={(e) => setOperatingHours({ ...operatingHours, open: e.target.value })}
                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Close</label>
                                    <input
                                        type="text"
                                        value={operatingHours.close}
                                        onChange={(e) => setOperatingHours({ ...operatingHours, close: e.target.value })}
                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <p className="mt-4 text-slate-600">
                                Open: <span className="font-bold">{operatingHours.open}</span> - Close: <span className="font-bold">{operatingHours.close}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GymProfile;