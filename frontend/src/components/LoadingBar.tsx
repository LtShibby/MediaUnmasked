import React, { useState, useEffect } from "react";

interface LoadingBarProps {
  isLoading: boolean;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ isLoading }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  
  const steps = [
    "Analyzing headline vs content for contradictions...",
    "Analyzing for evidence...",
    "Analyzing for manipulative language...",
    "Analyzing for bias..."
  ];

  const updateStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Reset state when loading starts
  useEffect(() => {
    if (isLoading && !hasStarted) {
      setHasStarted(true);
      setCurrentStep(0);
      setLoadingText(steps[0]);
    } else if (!isLoading) {
      setHasStarted(false);
    }
  }, [isLoading]);

  // Progress through steps while loading
  useEffect(() => {
    if (isLoading && hasStarted && currentStep < steps.length) {
      const intervalId = setInterval(() => {
        setLoadingText(steps[currentStep]);
        updateStep();
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [isLoading, currentStep, hasStarted]);

  if (!isLoading || !hasStarted) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md text-center space-y-6 animate-fade-in">
        {/* Gradient and Animated Progress Bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full 
                     transition-all duration-500 ease-in-out animate-pulse"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Dynamic Text */}
        <p className="text-lg text-gray-700 font-inter leading-relaxed tracking-wide animate-text-smooth">
          {loadingText}
        </p>
        
        {/* Animated Dots */}
        <div className="mt-4 flex justify-center space-x-2">
          {steps.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300
                ${idx <= currentStep ? 'bg-blue-500 animate-bounce' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingBar;
