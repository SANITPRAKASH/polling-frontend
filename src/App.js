import React, { useState, useEffect } from "react";
import { useSocket } from "./hooks/useSocket";
import { usePollTimer } from "./hooks/usePollTimer";
import Welcome from "./components/Welcome";
import StudentName from "./components/StudentName";
import StudentWaiting from "./components/StudentWaiting";
import StudentQuestion from "./components/StudentQuestion";
import StudentResults from "./components/StudentResults";
import TeacherCreate from "./components/TeacherCreate";
import TeacherLive from "./components/TeacherLive";
import TeacherHistory from "./components/TeacherHistory";
import KickedOut from "./components/KickedOut";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // User state
  const [userType, setUserType] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [view, setView] = useState("welcome");

  // Poll state
  const [currentPoll, setCurrentPoll] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState(null);
  const [userCount, setUserCount] = useState({ total: 0, students: 0 });

  // Socket connection
  const { socket, isConnected } = useSocket();

  // Timer for students
  const {
    timeLeft,
    start: startTimer,
    stop: stopTimer,
  } = usePollTimer(60, () => {
    toast.warning("Time is up!");
    if (currentPoll && !studentAnswer) {
      setView("student-results");
    }
  });

  // Initialize socket listeners
  useEffect(() => {
    if (!socket) return;

    // Connection status
    socket.on("connect", () => {
      console.log("Connected to server");
      toast.success("Connected to server");

      // Rejoin if user was already logged in
      if (userType === "student" && studentName) {
        socket.emit("student:join", studentName);
      } else if (userType === "teacher") {
        socket.emit("teacher:join");
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      toast.error("Disconnected from server");
    });

    // Student events
    socket.on("student:joined", (data) => {
      console.log("Student joined successfully:", data);
      setView("student-waiting");
    });

    socket.on("student:kicked", (data) => {
      console.log("Student kicked:", data);
      toast.error(data.message);
      stopTimer();
      setCurrentPoll(null);
      setStudentAnswer(null);
      setView("kicked-out");
    });

    // Poll events
    socket.on("poll:active", (data) => {
      console.log("Active poll received:", data);
      
      // Only show poll if it's actually active and has time remaining
      if (data.poll && data.poll.isActive && data.remainingTime > 0) {
        setCurrentPoll(data.poll);
        if (userType === "student") {
          setView("student-question");
          startTimer(data.remainingTime);
        }
      } else {
        // No active poll or time expired
        if (userType === "student") {
          setView("student-waiting");
        }
        setCurrentPoll(null);
      }
    });

    socket.on("poll:started", (data) => {
      console.log("New poll started:", data);
      setCurrentPoll(data.poll);
      setStudentAnswer(null); // Reset for new poll

      if (userType === "student") {
        setView("student-question");
        startTimer(data.remainingTime);
        toast.info("New question from teacher!");
      } else if (userType === "teacher") {
        setView("teacher-live");
      }
    });

    socket.on("poll:update", (data) => {
      console.log("Poll updated:", data);
      setCurrentPoll(data.poll);
    });

    socket.on("poll:ended", (data) => {
      console.log("Poll ended:", data);
      stopTimer();
      
      if (userType === "student") {
        if (studentAnswer) {
          // Student already answered, show results
          setView("student-results");
        } else {
          // Student didn't answer, go back to waiting
          setView("student-waiting");
          setCurrentPoll(null);
        }
      }
    });

    // Vote events
    socket.on("vote:success", (data) => {
      console.log("Vote submitted successfully");
      setCurrentPoll(data.poll);
      setView("student-results");
      stopTimer();
      toast.success("Vote submitted successfully!");
    });

    socket.on("vote:error", (data) => {
      console.error("Vote error:", data.message);
      toast.error(data.message);
    });

    // User count
    socket.on("users:count", (data) => {
      setUserCount(data);
    });

    // Teacher events
    socket.on("teacher:joined", () => {
      console.log("Teacher joined successfully");
      // Check if there's an active poll
      fetch(
        `${
          process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"
        }/api/polls/active`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.poll && data.poll.isActive && data.remainingTime > 0) {
            setCurrentPoll(data.poll);
            setView("teacher-live");
          } else {
            setView("teacher-create");
          }
        })
        .catch((err) => {
          console.error("Error fetching active poll:", err);
          setView("teacher-create");
        });
    });

    // Error handling
    socket.on("error", (data) => {
      console.error("Socket error:", data.message);
      toast.error(data.message);
    });

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("student:joined");
      socket.off("student:kicked");
      socket.off("poll:active");
      socket.off("poll:started");
      socket.off("poll:update");
      socket.off("poll:ended");
      socket.off("vote:success");
      socket.off("vote:error");
      socket.off("users:count");
      socket.off("teacher:joined");
      socket.off("error");
    };
  }, [socket, userType, studentName, studentAnswer, startTimer, stopTimer]);

  // Handle role selection
  const handleSelectRole = (role) => {
    setUserType(role);
    if (role === "teacher") {
      socket.emit("teacher:join");
    } else {
      setView("student-name");
    }
  };

  // Handle student name submission
  const handleStudentNameSubmit = (name) => {
    setStudentName(name);
    socket.emit("student:join", name);
  };

  // Handle teacher creating a poll
  const handleCreatePoll = (pollData) => {
    console.log("Creating poll:", pollData);
    socket.emit("poll:create", pollData);
    toast.info("Creating poll...");
  };

  // Handle student submitting vote
  const handleSubmitVote = (pollId, studentName, optionId) => {
    console.log("Submitting vote:", { pollId, studentName, optionId });
    setStudentAnswer(optionId);
    socket.emit("vote:submit", { pollId, studentName, optionId });
  };

  // Handle teacher viewing history
  const handleViewHistory = () => {
    setView("teacher-history");
  };

  // Handle teacher asking new question
  const handleAskNewQuestion = () => {
    setView("teacher-create");
    setCurrentPoll(null);
  };

  // Handle back from history
  const handleBackFromHistory = () => {
    if (currentPoll && currentPoll.isActive) {
      setView("teacher-live");
    } else {
      setView("teacher-create");
    }
  };

  // Render appropriate view
  const renderView = () => {
    if (!isConnected) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to server...</p>
          </div>
        </div>
      );
    }

    switch (view) {
      case "welcome":
        return <Welcome onSelectRole={handleSelectRole} />;

      case "student-name":
        return <StudentName onSubmit={handleStudentNameSubmit} />;

      case "student-waiting":
        return <StudentWaiting />;

      case "student-question":
        return currentPoll ? (
          <StudentQuestion
            poll={currentPoll}
            timeLeft={timeLeft}
            onSubmitVote={handleSubmitVote}
            studentName={studentName}
            socket={socket} 
          />
        ) : (
          <StudentWaiting />
        );

      case "student-results":
        return currentPoll ? (
          <StudentResults
            poll={currentPoll}
            studentAnswer={studentAnswer}
            studentName={studentName} 
            socket={socket} 
          />
        ) : (
          <StudentWaiting />
        );

      case "kicked-out":
        return <KickedOut />;

      case "teacher-create":
        return <TeacherCreate onCreatePoll={handleCreatePoll} />;

      case "teacher-live":
        return currentPoll ? (
          <TeacherLive
            poll={currentPoll}
            onViewHistory={handleViewHistory}
            onAskNew={handleAskNewQuestion}
            userCount={userCount}
            socket={socket}
          />
        ) : (
          <TeacherCreate onCreatePoll={handleCreatePoll} />
        );

      case "teacher-history":
        return (
          <TeacherHistory socket={socket} onBack={handleBackFromHistory} />
        );

      default:
        return <Welcome onSelectRole={handleSelectRole} />;
    }
  };

  return (
    <>
      {renderView()}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;