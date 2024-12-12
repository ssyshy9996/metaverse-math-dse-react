import React from "react";

interface ProgressBarProps {
    isLoading: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isLoading }) => {
    if (!isLoading) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-10">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-400 mt-2 ml-2">Processing, please wait...</p>
        </div>
    );
};

export default ProgressBar;
