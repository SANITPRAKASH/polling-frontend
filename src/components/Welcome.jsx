import React from 'react';

const Welcome = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            INTERVUE.IO
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to the Live Polling System
          </h1>
          <p className="text-gray-600">
            Select your role to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => onSelectRole('student')}
            className="border-2 border-gray-200 rounded-lg p-6 text-left hover:border-purple-500 transition-colors"
          >
            <h3 className="font-semibold text-lg mb-2">I'm a Student</h3>
            <p className="text-sm text-gray-600">
              Join a live polling session and submit your answers in real-time
            </p>
          </button>

          <button
            onClick={() => onSelectRole('teacher')}
            className="border-2 border-gray-200 rounded-lg p-6 text-left hover:border-purple-500 transition-colors"
          >
            <h3 className="font-semibold text-lg mb-2">I'm a Teacher</h3>
            <p className="text-sm text-gray-600">
              Create live polls and track student responses
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;