import React from "react";

function BattingTable({ battingStats }) {
  return (
    <div className="cricket-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Batting Scorecard</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {battingStats.filter(p => !p.out).length} wickets remaining
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="table-header">
              <th className="table-cell text-left w-1/3">Batsman</th>
              <th className="table-cell text-center">R</th>
              <th className="table-cell text-center">B</th>
              <th className="table-cell text-center">4s</th>
              <th className="table-cell text-center">6s</th>
              <th className="table-cell text-center">SR</th>
              <th className="table-cell text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {battingStats.map((player, idx) => {
              const strikeRate = player.balls > 0 
                ? Math.round((player.runs / player.balls) * 100) 
                : 0;
              
              return (
                <tr 
                  key={idx} 
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="table-cell text-left font-medium">
                    <div className="flex items-center">
                      {player.name}
                      {idx < 2 && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          {idx === 0 ? '⚡ Striker' : 'Non-striker'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell text-center font-medium">
                    {player.runs}
                  </td>
                  <td className="table-cell text-center">{player.balls}</td>
                  <td className="table-cell text-center">
                    {player.fours > 0 ? (
                      <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs">
                        {player.fours}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="table-cell text-center">
                    {player.sixes > 0 ? (
                      <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs">
                        {player.sixes}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="table-cell text-center">{strikeRate}</td>
                  <td className="table-cell text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      player.out 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {player.out ? (
                        <>
                          <span className="hidden sm:inline">Out</span>
                          <span className="sm:hidden">W</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">Not Out</span>
                          <span className="sm:hidden">-</span>
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <div>Total: {battingStats.reduce((sum, p) => sum + p.runs, 0)} runs</div>
        <div>Extras: {/* Add extras calculation here if available */}</div>
      </div>
    </div>
  );
}

export default BattingTable;