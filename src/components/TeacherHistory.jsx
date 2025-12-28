import React, { useEffect, useState } from 'react';

const TeacherHistory = ({ socket, onBack }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (socket) {
      socket.emit('poll:history');

      socket.on('poll:history:data', (data) => {
        if (data.success) {
          setHistory(data.polls || []);
        }
        setLoading(false);
      });

      return () => {
        socket.off('poll:history:data');
      };
    }
  }, [socket]);

  const calculatePercentage = (votes, total) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">View Poll History</h1>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">No poll history yet. Create your first poll!</p>
          </div>
        ) : (
          history.map((poll, index) => (
            <div key={poll._id} className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <h3 className="font-bold mb-4">Question {index + 1}</h3>
              <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
                <p>{poll.question}</p>
              </div>

              <div className="space-y-3 mb-4">
                {poll.options.map((option, optIndex) => {
                  const percentage = calculatePercentage(option.votes, poll.totalVotes);
                  
                  return (
                    <div key={option._id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs mr-2">
                            {optIndex + 1}
                          </span>
                          <span>{option.text}</span>
                        </div>
                        <span className="font-semibold">{percentage}%</span>
                      </div>
                      <div className="h-8 bg-gray-200 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-purple-600"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-sm text-gray-600">
                Total votes: {poll.totalVotes}
              </div>
            </div>
          ))
        )}

        <button
          onClick={onBack}
          className="w-full bg-purple-600 text-white py-3 rounded-full font-medium hover:bg-purple-700 transition-colors mt-4"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default TeacherHistory;