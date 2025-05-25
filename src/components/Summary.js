import React from "react";
import RunRateChart from "./RunRateChart";

function Summary({ teamA, teamB, firstInnings, secondInnings }) {
  const scoreA = firstInnings.totalRuns;
  const scoreB = secondInnings.totalRuns;

  const winner =
    scoreB > scoreA ? teamB.name : scoreB < scoreA ? teamA.name : "Draw";
  const loser =
    scoreB > scoreA ? teamA.name : scoreB < scoreA ? teamB.name : null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded text-center">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">🏁 Match Summary</h2>

      <div className="mb-4">
        <p className="text-lg">
          <strong>{teamA.name}</strong>: {scoreA} runs
        </p>
        <p className="text-lg">
          <strong>{teamB.name}</strong>: {scoreB} runs
        </p>
      </div>

      {winner === "Draw" ? (
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          🤝 The match ended in a Draw!
        </h3>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-green-700 mb-1">
            🏆 {winner} won the match!
          </h3>
          <p className="text-sm text-gray-600">
            Great effort by <strong>{loser}</strong> — better luck next time! 💪
          </p>
        </>
      )}

      <div className="mt-6">
        <h4 className="text-lg font-bold mb-2">📊 Run Rate Comparison</h4>
        <RunRateChart
          innings1={firstInnings.runsPerOver}
          innings2={secondInnings.runsPerOver}
        />
      </div>
    </div>
  );
}

export default Summary;
