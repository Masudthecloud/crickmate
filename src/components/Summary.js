import React, { useState } from "react";
import RunRateChart from "./RunRateChart";
import { getManOfTheMatch } from "../utils";

function Summary({ teamA, teamB, firstInnings, secondInnings }) {
  const firstScore = firstInnings.totalRuns;
  const secondScore = secondInnings.totalRuns;
  const target = firstScore + 1;
  const wicketsLost = secondInnings.battingStats.filter((p) => p.out).length;

  let result = "";
  if (secondScore >= target) {
    const remainingWickets = 10 - wicketsLost;
    result = `${teamA.name} won by ${remainingWickets} wicket${remainingWickets > 1 ? "s" : ""}`;
  } else if (secondScore === firstScore) {
    result = "Match Tied";
  } else {
    const runDiff = firstScore - secondScore;
    result = `${teamB.name} won by ${runDiff} run${runDiff > 1 ? "s" : ""}`;
  }

  const motm = getManOfTheMatch(
    firstInnings.battingStats,
    secondInnings.battingStats,
    firstInnings.bowlingStats,
    secondInnings.bowlingStats,
    teamA.players,
    teamB.players
  );

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const summaryText = `
🏏 Match Summary
${teamA.name}: ${firstScore} runs
${teamB.name}: ${secondScore} runs
Result: ${result}
Man of the Match: ${motm?.name || "N/A"} — ${motm?.runs || 0} runs, ${motm?.wickets || 0} wickets
`;
    navigator.clipboard.writeText(summaryText.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const handleDownload = () => {
    const summaryText = `
🏏 CrickMate - Match Summary

${teamA.name}: ${firstScore} runs
${teamB.name}: ${secondScore} runs
Result: ${result}

Man of the Match: ${motm?.name || "N/A"} — ${motm?.runs || 0} runs, ${motm?.wickets || 0} wickets
`;

    const blob = new Blob([summaryText.trim()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "CrickMate-Match-Summary.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-10">
      <h2 className="text-3xl font-bold text-green-700 mb-4">🏁 Match Summary</h2>

      <div className="mb-6 text-center">
        <p className="text-lg mb-2 font-medium">{teamA.name}: {firstScore} runs</p>
        <p className="text-lg mb-2 font-medium">{teamB.name}: {secondScore} runs</p>
        <p className="text-xl mt-4 font-bold text-indigo-700">{result}</p>
      </div>

      <div className="w-full max-w-2xl mb-8">
        <RunRateChart
          innings1={firstInnings.runsPerOver}
          innings2={secondInnings.runsPerOver}
        />
      </div>

      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Batting Scorecard: {teamA.name}</h3>
        <table className="w-full text-sm border mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-2 py-1">Batsman</th>
              <th className="text-right px-2 py-1">R</th>
              <th className="text-right px-2 py-1">B</th>
              <th className="text-right px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {firstInnings.battingStats.map((p, i) => (
              <tr key={i} className="border-t">
                <td className="px-2 py-1">{p.name}</td>
                <td className="px-2 py-1 text-right">{p.runs}</td>
                <td className="px-2 py-1 text-right">{p.balls}</td>
                <td className="px-2 py-1 text-right">
                  {p.out ? "Out" : p.balls > 0 ? "Not Out" : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">Batting Scorecard: {teamB.name}</h3>
        <table className="w-full text-sm border mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-2 py-1">Batsman</th>
              <th className="text-right px-2 py-1">R</th>
              <th className="text-right px-2 py-1">B</th>
              <th className="text-right px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {secondInnings.battingStats.map((p, i) => (
              <tr key={i} className="border-t">
                <td className="px-2 py-1">{p.name}</td>
                <td className="px-2 py-1 text-right">{p.runs}</td>
                <td className="px-2 py-1 text-right">{p.balls}</td>
                <td className="px-2 py-1 text-right">
                  {p.out ? "Out" : p.balls > 0 ? "Not Out" : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🏆 Man of the Match */}
      <div className="text-center mt-6 text-lg font-medium text-purple-800">
        🏆 <span className="font-bold">Man of the Match:</span>{" "}
        {motm
          ? `${motm.name} — ${motm.runs} runs, ${motm.wickets} wicket${motm.wickets !== 1 ? "s" : ""}`
          : "Not available"}
      </div>

      {/* 🔁 Restart / 📋 Copy / ⬇️ Download */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
        >
          🔁 Restart Match
        </button>
        <button
          onClick={handleCopy}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg shadow"
        >
          📋 {copied ? "Copied!" : "Copy Summary"}
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
        >
          ⬇️ Download Summary
        </button>
      </div>
    </div>
  );
}

export default Summary;
