import React, { useState } from 'react';
import SidePanel from './SidePanel';

const StudentResults = ({ poll, studentAnswer, studentName, socket }) => {
  const [showPanel, setShowPanel] = useState(false);

  const calculatePercentage = (votes, total) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-3xl mx-auto pt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Question 1</h2>
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                ✓ Submitted
              </span>
            </div>

            <div className="bg-gray-800 text-white p-4 rounded-lg mb-6">
              <p className="text-lg">{poll.question}</p>
            </div>

            <div className="space-y-4 mb-6">
              {poll.options.map((option) => {
                const percentage = calculatePercentage(option.votes, poll.totalVotes);
                const isUserAnswer = option._id === studentAnswer;
                
                return (
                  <div key={option._id} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isUserAnswer ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isUserAnswer ? '✓' : '○'}
                        </span>
                        <span className="ml-2 text-gray-800">{option.text}</span>
                      </div>
                      <span className="font-semibold">{percentage}%</span>
                    </div>
                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isUserAnswer ? 'bg-purple-600' : 'bg-purple-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    {isUserAnswer && (
                      <span className="text-xs text-purple-600 font-medium mt-1 block">
                        Your answer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-center text-gray-600">
              Wait for the teacher to ask a new question.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Side Panel */}
      {showPanel && (
        <div className="fixed right-0 top-0 bottom-0 w-80 shadow-lg z-40">
          <SidePanel 
            socket={socket}
            userType="student"
            userName={studentName}
            students={[]}
          />
        </div>
      )}
    </div>
  );
};

export default StudentResults;