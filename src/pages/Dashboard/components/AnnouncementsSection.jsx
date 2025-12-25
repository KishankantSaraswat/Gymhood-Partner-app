import React from 'react';

const AnnouncementsSection = () => {
    return (
        <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Announcements</h2>

            <div className="space-y-4">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 relative">
                    <span className="absolute top-4 right-4 text-xs font-bold text-indigo-600 bg-white px-2 py-1 rounded-lg shadow-sm">
                        New
                    </span>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-bullhorn"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900 text-lg mb-2">Platform Maintenance Update</h3>
                            <p className="text-indigo-800 text-sm mb-3">
                                We will be performing scheduled maintenance on Dec 5th from 2 AM to 4 AM. During this time, the dashboard may be inaccessible.
                            </p>
                            <p className="text-xs text-indigo-600 font-medium">Posted by Admin • 2 hours ago</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-gift"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">New Year Campaign</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                Join our upcoming "New Year, New You" campaign to boost your January enrollments. Opt-in before Dec 20th.
                            </p>
                            <p className="text-xs text-slate-400 font-medium">Posted by Admin • 2 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsSection;
