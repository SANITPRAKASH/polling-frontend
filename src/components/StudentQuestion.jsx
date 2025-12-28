
import React, { useState } from 'react';
import SidePanel from './SidePanel';

const StudentQuestion = ({ poll, timeLeft, onSubmitVote, studentName, socket }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const handleSubmit = () => {
    if (selectedOption && !hasSubmitted) {
      setHasSubmitted(true);
      onSubmitVote(poll._id, studentName, selectedOption);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-4">
        <div className="max-w-3xl mx-auto pt-4 sm:pt-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-lg sm:text-xl font-bold">Question 1</h2>
              <div className="flex items-center space-x-2">
                <span className={`font-semibold px-3 py-1 rounded-full text-sm transition-colors ${
                  timeLeft < 10 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  ⏱ {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="bg-gray-800 text-white p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <p className="text-base sm:text-lg">{poll.question}</p>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              {poll.options.map((option) => (
                <label
                  key={option._id}
                  className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedOption === option._id
                      ? 'border-purple-600 bg-purple-50 scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${hasSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="answer"
                    checked={selectedOption === option._id}
                    onChange={() => !hasSubmitted && setSelectedOption(option._id)}
                    className="w-4 h-4 text-purple-600"
                    disabled={hasSubmitted}
                  />
                  <span className="ml-3 text-sm sm:text-base text-gray-800">{option.text}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedOption || hasSubmitted}
              className="w-full bg-purple-600 text-white py-2.5 sm:py-3 rounded-full font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {hasSubmitted ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`fixed w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center z-50 ${
          showPanel ? 'bottom-24 right-4 sm:bottom-28 sm:right-8' : 'bottom-4 right-4 sm:bottom-8 sm:right-8'
        }`}
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Side Panel */}
      {showPanel && (
        <>
          {/* Overlay for mobile */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setShowPanel(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 lg:w-80 shadow-lg z-40 animate-slide-in">
            <SidePanel 
              socket={socket}
              userType="student"
              userName={studentName}
              students={[]}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default StudentQuestion;