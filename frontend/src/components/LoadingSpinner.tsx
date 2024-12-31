import React from "react";

interface LoadingSpinnerProps {
    size?: string;
    color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = (
    {
       size = "w-8 h-8",
       color = "text-blue-500",
    }) => {
    return (
        <div className="flex justify-center items-center">
            <div
                className={`${size} ${color} border-4 border-dashed rounded-full animate-spin border-t-transparent`}
            ></div>
        </div>
    );
};

export default LoadingSpinner;
