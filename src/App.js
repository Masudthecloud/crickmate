import React, { useState } from "react";
import SetupForm from "./components/SetupForm";
import Scorecard from "./components/Scorecard";
import Summary from "./components/Summary";

function App() {
  const [stage, setStage] = useState("setup");

  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);

  const [firstInningsData, setFirstInningsData] = useState(null);
  const [secondInningsData, setSecondInningsData] = useState(null);

  const handleStart = (a, b) => {
    setTeamA(a);
    setTeamB(b);
    setStage("firstInnings");
  };

  const handleFirstInningsComplete = (summary) => {
    setFirstInningsData(summary);
    setStage("midInnings");
  };

  const handleSecondInningsComplete = (summary) => {
    setSecondInningsData(summary);
    setStage("summary");
  };

  return (
    <>
      <h1 className="text-3xl font-extrabold text-indigo-700 text-center mb-6 tracking-wide">
        🏏 CrickMate
      </h1>
      <p className="text-center text-gray-600 mb-6 text-sm">
        The Ultimate Live Cricket Scorecard
      </p>
      {stage === "setup" && <SetupForm onStart={handleStart} />}
      {stage === "firstInnings" && (
        <Scorecard
          teamA={teamA}
          teamB={teamB}
          onInningsComplete={handleFirstInningsComplete}
          isChasing={false}
        />
      )}
      {stage === "midInnings" && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
          <h2 className="text-2xl font-bold text-indigo-600 mb-2">
            End of First Innings
          </h2>
          <p className="mb-4 text-lg">
            {teamA.name} scored <strong>{firstInningsData.totalRuns}</strong> runs
            in {Math.floor(firstInningsData.balls / 6)}.{firstInningsData.balls % 6} overs
          </p>
          <button
            onClick={() => setStage("secondInnings")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Start Second Innings
          </button>
        </div>
      )}
      {stage === "secondInnings" && (
        <Scorecard
          teamA={teamB}
          teamB={teamA}
          target={firstInningsData.totalRuns + 1}
          isChasing={true}
          onInningsComplete={handleSecondInningsComplete}
        />
      )}
      {stage === "summary" && (
        <Summary
          teamA={teamA}
          teamB={teamB}
          firstInnings={firstInningsData}
          secondInnings={secondInningsData}
        />
      )}
    </>
  );
}

export default App;
