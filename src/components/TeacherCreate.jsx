import React, { useState } from 'react';

const TeacherCreate = ({ onCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]);
  const [timeLimit, setTimeLimit] = useState(60);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { text: '', isCorrect: false }]);
    }
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validOptions = options.filter(opt => opt.text.trim() !== '');
    
    if (question.trim() && validOptions.length >= 2) {
      onCreatePoll({
        question: question.trim(),
        options: validOptions,
        timeLimit
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto pt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <div className="inline-block bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              INTERVUE.IO
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Let's Get Started
            </h1>
            <p className="text-sm text-gray-600">
              If you're a teacher, you'll have the ability to <span className="font-semibold">ask poll questions</span> and monitor live polls. Ask questions, add options, and interact with students through a live chat feature
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your question
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What planet is known as the Red Planet?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                maxLength={240}
                required
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {question.length}/240
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Math.max(10, Math.min(300, parseInt(e.target.value) || 60)))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                min="10"
                max="300"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Edit Options
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Is it Correct?
                </label>
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => updateOption(index, 'text', e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                    <div className="flex space-x-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`correct-${index}`}
                          checked={option.isCorrect}
                          onChange={() => updateOption(index, 'isCorrect', true)}
                          className="mr-1"
                        />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`correct-${index}`}
                          checked={!option.isCorrect}
                          onChange={() => updateOption(index, 'isCorrect', false)}
                          className="mr-1"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-3 text-purple-600 text-sm font-medium hover:text-purple-700"
                >
                  + Add more option
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-full font-medium hover:bg-purple-700 transition-colors"
            >
              Ask Question
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherCreate;