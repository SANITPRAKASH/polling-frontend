import React, { useState } from 'react';

const StudentName = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            INTERVUE.IO
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Let's Get Started
          </h1>
          <p className="text-sm text-gray-600">
            If you're a student, you'll be asked to <span className="font-semibold">submit your answers</span>, contributing to live polls, while also live view responses and track your classmates'
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahul Bajaj"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-full font-medium hover:bg-purple-700 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentName;