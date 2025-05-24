import React from "react";

function BattingTable({ battingStats }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Batting Scorecard</h3>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-1 px-2 text-left">Batsman</th>
            <th className="py-1 px-2 text-right">R</th>
            <th className="py-1 px-2 text-right">B</th>
            <th className="py-1 px-2 text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {battingStats.map((p, idx) => (
            <tr key={idx} className="border-t">
              <td className="py-1 px-2">{p.name}</td>
              <td className="py-1 px-2 text-right">{p.runs}</td>
              <td className="py-1 px-2 text-right">{p.balls}</td>
              <td className="py-1 px-2 text-right">
                {p.out ? "Out" : p.balls > 0 ? "Not Out" : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BattingTable;
