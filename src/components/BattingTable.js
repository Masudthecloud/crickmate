import React from "react";

function BattingTable({ battingStats }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-center">Batting Scorecard</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-300">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2 border">Batsman</th>
              <th className="p-2 border text-center">Runs</th>
              <th className="p-2 border text-center">Balls</th>
              <th className="p-2 border text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {battingStats.map((player, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2 border">{player.name}</td>
                <td className="p-2 border text-center">{player.runs}</td>
                <td className="p-2 border text-center">{player.balls}</td>
                <td className="p-2 border text-center">
                  {player.out ? "Out" : "Not Out"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BattingTable;
