import React, { useState, useEffect } from "react";
import SetupForm from "./components/SetupForm";
import Scorecard from "./components/Scorecard";
import Summary from "./components/Summary";

const LOCAL_KEY = "crickmate_match_state";

function App() {
  const [stage, setStage] = useState("setup");
  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [firstInningsData, setFirstInningsData] = useState(null);
  const [secondInningsData, setSecondInningsData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setStage(state.stage);
        setTeamA(state.teamA);
        setTeamB(state.teamB);
        setMatchData(state.matchData);
        setFirstInningsData(state.firstInningsData);
        setSecondInningsData(state.secondInningsData);
      } catch (e) {
        console.error("Failed to load match data", e);
      }
    }
  }, []);

  useEffect(() => {
    if (matchData) {
      localStorage.setItem(
        LOCAL_KEY,
        JSON.stringify({
          stage,
          teamA,
          teamB,
          matchData,
          firstInningsData,
          secondInningsData,
        })
      );
    }
  }, [stage, teamA, teamB, matchData, firstInningsData, secondInningsData]);

  const handleStart = (a, b, overs) => {
    setTeamA(a);
    setTeamB(b);
    setMatchData({
      runs: 0,
      wickets: 0,
      balls: 0,
      oversLimit: overs,
      battingStats: a.players.map((p) => ({
        name: p,
        runs: 0,
        balls: 0,
        out: false,
        log: [],
      })),
      bowlingStats: b.players.map((p) => ({
        name: p,
        runsConceded: 0,
        balls: 0,
        wickets: 0,
        log: [],
      })),
      runsPerOver: [],
      ballLog: [],
    });
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

  const resetMatch = () => {
    localStorage.removeItem(LOCAL_KEY);
    window.location.reload();
  };

  if (stage !== "setup" && (!matchData || !matchData.battingStats)) {
    return (
      <div className="text-center mt-10 text-red-600">
        ⚠️ Match data could not be restored.{" "}
        <button
          onClick={resetMatch}
          className="underline text-blue-700 hover:text-blue-900"
        >
          Click here to reset.
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="text-center mb-6">
        <img
          src={`${process.env.PUBLIC_URL}/crickmate-logo.png`}
          alt="CrickMate Logo"
          className="mx-auto w-20 h-20 mb-2"
        />
        <h1 className="text-3xl font-extrabold text-indigo-700 tracking-wide">
          CrickMate
        </h1>
        <p className="text-gray-600 text-sm">
          The Ultimate Live Cricket Scorecard
        </p>
      </div>

      {stage === "setup" && <SetupForm onStart={handleStart} />}

      {stage === "firstInnings" && teamA && teamB && matchData && (
        <Scorecard
          teamA={teamA}
          teamB={teamB}
          matchData={matchData}
          setMatchData={setMatchData}
          onInningsComplete={handleFirstInningsComplete}
          isChasing={false}
        />
      )}

      {stage === "midInnings" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">
            End of First Innings
          </h2>
          <p className="mb-4 text-gray-700 text-lg">
            {teamA.name} scored{" "}
            <strong>{firstInningsData.totalRuns}</strong> runs
          </p>
          <button
            onClick={() => {
              setMatchData({
                runs: 0,
                wickets: 0,
                balls: 0,
                oversLimit: matchData.oversLimit,
                battingStats: teamB.players.map((p) => ({
                  name: p,
                  runs: 0,
                  balls: 0,
                  out: false,
                  log: [],
                })),
                bowlingStats: teamA.players.map((p) => ({
                  name: p,
                  runsConceded: 0,
                  balls: 0,
                  wickets: 0,
                  log: [],
                })),
                runsPerOver: [],
                ballLog: [],
              });
              setStage("secondInnings");
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            Start Second Innings
          </button>
        </div>
      )}

      {stage === "secondInnings" && teamA && teamB && matchData && (
        <Scorecard
          teamA={teamB}
          teamB={teamA}
          matchData={matchData}
          setMatchData={setMatchData}
          isChasing={true}
          target={firstInningsData.totalRuns + 1}
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

      {stage !== "setup" && (
        <div className="mt-6 text-center">
          <button
            onClick={resetMatch}
            className="text-sm text-red-600 hover:underline"
          >
            🔄 Reset & Start Over
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
