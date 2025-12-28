import React, { useState, useEffect } from 'react';
import SidePanel from './SidePanel';

const TeacherLive = ({ poll, onViewHistory, onAskNew, userCount, socket }) => {
  const [students, setStudents] = useState([]);
  const [showPanel, setShowPanel] = useState(true);

  useEffect(() => {
    console.log('📡 TeacherLive mounted, socket:', socket?.id);
    
    if (socket) {
      socket.emit('request:student:list');
      
      socket.on('students:list', (data) => {
        console.log('📥 Received students:list in TeacherLive:', data);
        setStudents(data.students || []);
      });

      return () => {
        socket.off('students:list');
      };
    }
  }, [socket]);

  const calculatePercentage = (votes, total) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const handleKickStudent = (socketId, studentName) => {
    if (window.confirm(`Are you sure you want to remove ${studentName}?`)) {
      socket.emit('student:kick', { socketId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-4 lg:p-6">
        <div className="max-w-4xl mx-auto pt-4 sm:pt-6 lg:pt-8">
          {/* Action Buttons - Desktop Only */}
          <div className="hidden lg:flex justify-end mb-4 gap-2">
            <button 
              onClick={() => setShowPanel(!showPanel)}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              {showPanel ? 'Hide' : 'Show'} Panel
            </button>
            <button 
              onClick={onViewHistory}
              className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors"
            >
              View Poll History
            </button>
          </div>

          {/* Mobile History Button */}
          <div className="lg:hidden flex justify-end mb-4">
            <button 
              onClick={onViewHistory}
              className="bg-purple-600 text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors text-sm"
            >
              View History
            </button>
          </div>

          {/* Poll Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-bold">Question</h2>
                <div className="text-xs sm:text-sm text-gray-600">
                  Students online: <span className="font-semibold text-purple-600">{userCount?.students || 0}</span>
                </div>
              </div>
              <div className="bg-gray-800 text-white p-3 sm:p-4 rounded-lg">
                <p className="text-base sm:text-lg break-words">{poll.question}</p>
              </div>
            </div>

            {/* Options with Results */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {poll.options.map((option, index) => {
                const percentage = calculatePercentage(option.votes, poll.totalVotes);
                
                return (
                  <div key={option._id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center flex-1 min-w-0 mr-2">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mr-2">
                          {index + 1}
                        </span>
                        <span className="font-medium text-sm sm:text-base truncate">{option.text}</span>
                      </div>
                      <span className="font-semibold text-sm sm:text-base flex-shrink-0">{percentage}%</span>
                    </div>
                    <div className="h-8 sm:h-10 bg-gray-200 rounded-lg overflow-hidden relative">
                      <div
                        className="h-full bg-purple-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-end px-2 sm:px-4">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Students answered: {option.votes}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Responses */}
            <div className="text-center text-gray-600 mb-4 text-sm sm:text-base">
              Total responses: <span className="font-semibold">{poll.totalVotes}</span>
            </div>

            {/* Ask New Question Button */}
            <button
              onClick={onAskNew}
              className="w-full bg-purple-600 text-white py-2.5 sm:py-3 rounded-full font-medium hover:bg-purple-700 transition-colors text-sm sm:text-base"
            >
              + Ask a new question
            </button>
          </div>
        </div>
      </div>

      {/* Floating Chat Button - Mobile/Tablet Only */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`lg:hidden fixed w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center z-50 ${
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
          {/* Overlay for mobile/tablet - Click to close */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setShowPanel(false)}
          />
          <div className="fixed lg:relative right-0 top-0 bottom-0 w-full sm:w-96 lg:w-80 shadow-lg z-40 lg:z-0">
            {/* Close Button - Only on Mobile/Tablet */}
            <button
              onClick={() => setShowPanel(false)}
              className="absolute top-4 right-4 lg:hidden w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 z-50 shadow-lg"
              aria-label="Close panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <SidePanel 
              socket={socket}
              userType="teacher"
              userName="Teacher"
              students={students}
              onKickStudent={handleKickStudent}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherLive;