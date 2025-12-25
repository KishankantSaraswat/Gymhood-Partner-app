import React, { useState } from 'react';
import { Dumbbell, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';

const SignupPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;
    const navigate = useNavigate();

    const stepNames = ["Basic Info", "Gym Type", "Facilities", "Photos", "Documents"];

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/dashboard');
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/partner')}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white transform hover:scale-110 transition-transform">
                            <Dumbbell className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900">Gymshood</span>
                    </div>
                    <button onClick={() => navigate('/partner')} className="text-slate-500 hover:text-slate-900 text-sm font-medium">Save & Exit</button>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 mt-8">
                <div className="mb-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-slate-900">Step {currentStep} of {totalSteps}</span>
                        <span className="text-sm text-slate-500 font-medium">{stepNames[currentStep - 1]}</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200 p-6 md:p-10 animate-fade-in-up">
                    {currentStep === 1 && <Step1 />}
                    {currentStep === 2 && <Step2 />}
                    {currentStep === 3 && <Step3 />}
                    {currentStep === 4 && <Step4 />}
                    {currentStep === 5 && <Step5 />}

                    <div className="flex items-center justify-between mt-8">
                        {currentStep > 1 && (
                            <button onClick={prevStep} className="bg-white border border-slate-200 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-all flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Previous
                            </button>
                        )}
                        <button onClick={nextStep} className="ml-auto bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2">
                            {currentStep === totalSteps ? 'Submit Registration' : 'Next Step'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
