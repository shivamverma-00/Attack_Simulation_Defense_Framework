import React from 'react';

const LoadingSpinner = ({ message = "Loading...", size = "medium" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-12 h-12", 
    large: "w-16 h-16"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-cyber-blue border-t-transparent rounded-full loading-spinner mb-4`}></div>
      <div className="text-center">
        <p className="text-gray-400 mb-2">{message}</p>
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-cyber-blue rounded-full loading-dots"></div>
          <div className="w-2 h-2 bg-cyber-blue rounded-full loading-dots" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-cyber-blue rounded-full loading-dots" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
