import React from 'react';

const KickedOut = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 text-center">
        <div className="inline-block bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 sm:mb-6">
          INTERVUE.IO
        </div>
        
        {/* Warning Icon */}
        <div className="mb-4 sm:mb-6">
          <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Message */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          You've been Kicked out!
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
          Looks like the teacher has removed you from the poll system. Please try again sometime.
        </p>

        {/* Button */}
        <button
          onClick={handleReload}
          className="w-full bg-purple-600 text-white py-2.5 sm:py-3 rounded-full font-medium hover:bg-purple-700 transition-colors text-sm sm:text-base"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default KickedOut;