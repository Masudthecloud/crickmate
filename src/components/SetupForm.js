import React, { useState } from "react";

function SetupForm({ onStart }) {
  const [teamA, setTeamA] = useState({ name: "", players: Array(11).fill("") });
  const [teamB, setTeamB] = useState({ name: "", players: Array(11).fill("") });
  const [error, setError] = useState("");

  const handlePlayerChange = (team, index, value) => {
    const updated = [...(team === "A" ? teamA.players : teamB.players)];
    updated[index] = value;

    team === "A"
      ? setTeamA({ ...teamA, players: updated })
      : setTeamB({ ...teamB, players: updated });
  };

  const handleSubmit = () => {
    if (!teamA.name || !teamB.name) return setError("Both team names are required.");
    if (teamA.players.some(p => !p) || teamB.players.some(p => !p)) {
      return setError("All player names must be filled in.");
    }

    setError("");
    onStart(teamA, teamB); // pass data to parent App
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-6 md:p-10">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">🏏 Match Setup</h2>

        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Team A */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Team A (Batting First)</h3>
            <input
              type="text"
              placeholder="Team A Name"
              className="w-full mb-3 border p-2 rounded"
              value={teamA.name}
              onChange={(e) => setTeamA({ ...teamA, name: e.target.value })}
            />
            {teamA.players.map((p, i) => (
              <input
                key={i}
                type="text"
                className="w-full mb-2 border p-2 rounded text-sm"
                placeholder={`Player ${i + 1}`}
                value={p}
                onChange={(e) => handlePlayerChange("A", i, e.target.value)}
              />
            ))}
          </div>

          {/* Team B */}
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Team B (Bowling First)</h3>
            <input
              type="text"
              placeholder="Team B Name"
              className="w-full mb-3 border p-2 rounded"
              value={teamB.name}
              onChange={(e) => setTeamB({ ...teamB, name: e.target.value })}
            />
            {teamB.players.map((p, i) => (
              <input
                key={i}
                type="text"
                className="w-full mb-2 border p-2 rounded text-sm"
                placeholder={`Player ${i + 1}`}
                value={p}
                onChange={(e) => handlePlayerChange("B", i, e.target.value)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-lg font-medium shadow-md"
          >
            🚀 Start Match
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetupForm;
