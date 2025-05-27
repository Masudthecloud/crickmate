import React from "react";

function PlayerStats({ striker, nonStriker, bowler, onBowlerChange, onBatsmanChange }) {
  const strikerSR = striker.balls > 0 ? Math.round((striker.runs / striker.balls) * 100) : 0;
  const nonStrikerSR = nonStriker.balls > 0 ? Math.round((nonStriker.runs / nonStriker.balls) * 100) : 0;
  const bowlerEcon = bowler.balls > 0 ? ((bowler.runsConceded / bowler.balls) * 6).toFixed(2) : 0;
  const bowlerOvers = `${Math.floor(bowler.balls / 6)}.${bowler.balls % 6}`;

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Striker */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-blue-700">⚡ Striker</h3>
          <button 
            onClick={onBatsmanChange}
            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
          >
            Change
          </button>
        </div>
        <p className="text-xl font-bold">{striker.name}</p>
        <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
          <div>
            <span className="text-gray-500">Runs</span>
            <p className="font-medium">{striker.runs}</p>
          </div>
          <div>
            <span className="text-gray-500">Balls</span>
            <p className="font-medium">{striker.balls}</p>
          </div>
          <div>
            <span className="text-gray-500">SR</span>
            <p className="font-medium">{strikerSR}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          {striker.fours > 0 && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              4×{striker.fours}
            </span>
          )}
          {striker.sixes > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              6×{striker.sixes}
            </span>
          )}
        </div>
      </div>

      {/* Non-Striker */}
      <div className="border border-gray-200 rounded-lg p-3">
        <h3 className="font-bold text-gray-700 mb-2">Non-Striker</h3>
        <p className="text-xl font-bold">{nonStriker.name}</p>
        <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
          <div>
            <span className="text-gray-500">Runs</span>
            <p className="font-medium">{nonStriker.runs}</p>
          </div>
          <div>
            <span className="text-gray-500">Balls</span>
            <p className="font-medium">{nonStriker.balls}</p>
          </div>
          <div>
            <span className="text-gray-500">SR</span>
            <p className="font-medium">{nonStrikerSR}</p>
          </div>
        </div>
      </div>

      {/* Bowler */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-red-700">🎯 Bowler</h3>
          <button 
            onClick={onBowlerChange}
            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
          >
            Change
          </button>
        </div>
        <p className="text-xl font-bold">{bowler.name}</p>
        <div className="grid grid-cols-4 gap-2 mt-2 text-sm">
          <div>
            <span className="text-gray-500">Overs</span>
            <p className="font-medium">{bowlerOvers}</p>
          </div>
          <div>
            <span className="text-gray-500">Runs</span>
            <p className="font-medium">{bowler.runsConceded}</p>
          </div>
          <div>
            <span className="text-gray-500">Wkts</span>
            <p className="font-medium text-red-600">{bowler.wickets}</p>
          </div>
          <div>
            <span className="text-gray-500">Econ</span>
            <p className="font-medium">{bowlerEcon}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerStats;