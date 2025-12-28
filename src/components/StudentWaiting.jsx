import React from 'react';

const StudentWaiting = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-block bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6">
          INTERVUE.IO
        </div>
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Wait for the teacher to ask questions..
        </h2>
      </div>
    </div>
  );
};

export default StudentWaiting;