import React from "react";

function BowlingTable({ bowlingStats, playerNames }) {
  return (
    <div className="cricket-card">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Bowling Scorecard</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="table-header">
              <th className="table-cell text-left w-1/3">Bowler</th>
              <th className="table-cell text-center">O</th>
              <th className="table-cell text-center">M</th>
              <th className="table-cell text-center">R</th>
              <th className="table-cell text-center">W</th>
              <th className="table-cell text-center">Econ</th>
              <th className="table-cell text-center">0s</th>
            </tr>
          </thead>
          <tbody>
            {bowlingStats.map((bowler, idx) => {
              const overs = `${Math.floor(bowler.balls / 6)}.${bowler.balls % 6}`;
              const economy = bowler.balls > 0 
                ? ((bowler.runsConceded / bowler.balls) * 6).toFixed(2)
                : '0.00';
              const dotBalls = bowler.balls - (bowler.runsConceded - bowler.wickets); // Approximation
              
              return (
                <tr 
                  key={idx} 
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="table-cell text-left font-medium">
                    <div className="flex items-center">
                      {bowler.name || playerNames[idx]}
                      {idx === 0 && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell text-center">{overs}</td>
                  <td className="table-cell text-center">
                    {bowler.maidens || 0}
                  </td>
                  <td className="table-cell text-center">
                    {bowler.runsConceded}
                  </td>
                  <td className="table-cell text-center">
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                      {bowler.wickets}
                    </span>
                  </td>
                  <td className="table-cell text-center font-medium">
                    {economy}
                  </td>
                  <td className="table-cell text-center">
                    <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs">
                      {dotBalls}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <div>Total: {bowlingStats.reduce((sum, b) => sum + b.runsConceded, 0)} runs</div>
        <div>Extras: {/* Add extras calculation here if available */}</div>
      </div>
    </div>
  );
}

export default BowlingTable;