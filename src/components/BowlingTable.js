import React from "react";

function BowlingTable({ bowlingStats, playerNames }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Bowling Scorecard</h3>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-2 py-1">Bowler</th>
            <th className="text-right px-2 py-1">O</th>
            <th className="text-right px-2 py-1">R</th>
            <th className="text-right px-2 py-1">W</th>
          </tr>
        </thead>
        <tbody>
          {bowlingStats.map((bowler, idx) =>
            bowler.balls > 0 ? (
              <tr key={idx} className="border-t">
                <td className="px-2 py-1">{playerNames[idx]}</td>
                <td className="px-2 py-1 text-right">
                  {Math.floor(bowler.balls / 6)}.{bowler.balls % 6}
                </td>
                <td className="px-2 py-1 text-right">{bowler.runsConceded}</td>
                <td className="px-2 py-1 text-right">{bowler.wickets}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BowlingTable;
