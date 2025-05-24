import React from "react";

function PlayerStats({ striker, nonStriker, bowler, bowlerName }) {
  return (
    <div className="text-sm text-center mb-4">
      <p><strong>On Strike:</strong> {striker.name} – {striker.runs} ({striker.balls})</p>
      <p><strong>Non-Strike:</strong> {nonStriker.name} – {nonStriker.runs} ({nonStriker.balls})</p>
      <p><strong>Bowler:</strong> {bowlerName} – {Math.floor(bowler.balls / 6)}.{bowler.balls % 6} overs, {bowler.runsConceded} runs, {bowler.wickets} wickets</p>
    </div>
  );
}

export default PlayerStats;
