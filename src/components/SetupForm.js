import React, { useState } from "react";

function SetupForm({ onStart }) {
  const [teamAName, setTeamAName] = useState("Team A");
  const [teamBName, setTeamBName] = useState("Team B");
  const [numPlayers, setNumPlayers] = useState(11);
  const [numOvers, setNumOvers] = useState(20);
  const [teamAPlayers, setTeamAPlayers] = useState(Array(11).fill(""));
  const [teamBPlayers, setTeamBPlayers] = useState(Array(11).fill(""));

  const handleNumPlayersChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    setNumPlayers(count);
    setTeamAPlayers(Array(count).fill(""));
    setTeamBPlayers(Array(count).fill(""));
  };

  const handlePlayerNameChange = (team, index, value) => {
    const setter = team === "A" ? setTeamAPlayers : setTeamBPlayers;
    const current = team === "A" ? [...teamAPlayers] : [...teamBPlayers];
    current[index] = value;
    setter(current);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      teamAPlayers.some((p) => !p.trim()) ||
      teamBPlayers.some((p) => !p.trim())
    ) {
      alert("Please fill in all player names.");
      return;
    }

    onStart(
      { name: teamAName, players: teamAPlayers },
      { name: teamBName, players: teamBPlayers },
      numOvers
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-4 text-indigo-700">Match Setup</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          value={teamAName}
          onChange={(e) => setTeamAName(e.target.value)}
          className="p-2 border rounded"
          placeholder="Team A Name"
          required
        />
        <input
          type="text"
          value={teamBName}
          onChange={(e) => setTeamBName(e.target.value)}
          className="p-2 border rounded"
          placeholder="Team B Name"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Number of Players</label>
          <input
            type="number"
            value={numPlayers}
            min={2}
            max={22}
            onChange={handleNumPlayersChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Number of Overs</label>
          <input
            type="number"
            value={numOvers}
            min={1}
            max={50}
            onChange={(e) => setNumOvers(parseInt(e.target.value, 10))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">{teamAName} Players</h3>
          {teamAPlayers.map((name, idx) => (
            <input
              key={idx}
              type="text"
              value={name}
              onChange={(e) => handlePlayerNameChange("A", idx, e.target.value)}
              placeholder={`Player ${idx + 1}`}
              className="w-full p-2 border rounded mb-2"
              required
            />
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">{teamBName} Players</h3>
          {teamBPlayers.map((name, idx) => (
            <input
              key={idx}
              type="text"
              value={name}
              onChange={(e) => handlePlayerNameChange("B", idx, e.target.value)}
              placeholder={`Player ${idx + 1}`}
              className="w-full p-2 border rounded mb-2"
              required
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-lg"
      >
        🏏 Start Match
      </button>
    </form>
  );
}

export default SetupForm;
