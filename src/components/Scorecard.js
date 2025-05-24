import React, { useState, useRef } from "react";
import ScoreControls from "./ScoreControls";
import PlayerStats from "./PlayerStats";
import BattingTable from "./BattingTable";
import RunRateChart from "./RunRateChart";
import BowlingTable from "./BowlingTable";

function Scorecard({ teamA, teamB, onInningsComplete, isChasing = false, target = null }) {
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);

  const [battingStats] = useState(
    teamA.players.map((name) => ({ name, runs: 0, balls: 0, out: false }))
  );
  const [bowlingStats] = useState(
    teamB.players.map((name) => ({ name, runsConceded: 0, balls: 0, wickets: 0 }))
  );

  const [onStrikeIdx, setOnStrikeIdx] = useState(0);
  const [nonStrikeIdx, setNonStrikeIdx] = useState(1);
  const [bowlerIdx, setBowlerIdx] = useState(0);
  const [prevBowlerIdx, setPrevBowlerIdx] = useState(null);
  const [nextBatIdx, setNextBatIdx] = useState(2);

  const [runsPerOver, setRunsPerOver] = useState([]);
  const currentOverRuns = useRef(0);

  const overs = `${Math.floor(balls / 6)}.${balls % 6}`;

  const rotateStrike = () => {
    setOnStrikeIdx((prev) => {
      const temp = nonStrikeIdx;
      setNonStrikeIdx(prev);
      return temp;
    });
  };

  const updateOver = () => {
    setRunsPerOver((prev) => [...prev, currentOverRuns.current]);
    currentOverRuns.current = 0;

    rotateStrike();
    setPrevBowlerIdx(bowlerIdx);

    const nextBowler = teamB.players.findIndex((_, i) => i !== bowlerIdx && i !== prevBowlerIdx);
    if (nextBowler !== -1) setBowlerIdx(nextBowler);
  };

  const checkEndConditions = (nextRun) => {
    const totalBalls = balls + 1;
    const totalWickets = wickets + (nextRun === "wicket" ? 1 : 0);
    const finalRuns = runs + (typeof nextRun === "number" ? nextRun : 0);

    const isAllOut = totalWickets >= 10;
    const is20Overs = totalBalls >= 120;
    const targetReached = isChasing && finalRuns >= target;

    if (isAllOut || is20Overs || targetReached) {
      onInningsComplete({
        totalRuns: finalRuns,
        balls: totalBalls,
        battingStats,
        bowlingStats,
        runsPerOver: [...runsPerOver, currentOverRuns.current], // push last over
      });
      return true;
    }
    return false;
  };

  const handleRun = (r) => {
    if (checkEndConditions(r)) return;

    setRuns((t) => t + r);
    setBalls((b) => b + 1);
    currentOverRuns.current += r;

    battingStats[onStrikeIdx].runs += r;
    battingStats[onStrikeIdx].balls += 1;

    bowlingStats[bowlerIdx].runsConceded += r;
    bowlingStats[bowlerIdx].balls += 1;

    if (r % 2 === 1) rotateStrike();

    if ((balls + 1) % 6 === 0) updateOver();
  };

  const handleWicket = () => {
    if (checkEndConditions("wicket")) return;

    setWickets((w) => w + 1);
    setBalls((b) => b + 1);
    currentOverRuns.current += 0;

    battingStats[onStrikeIdx].balls += 1;
    battingStats[onStrikeIdx].out = true;

    bowlingStats[bowlerIdx].wickets += 1;
    bowlingStats[bowlerIdx].balls += 1;

    if (nextBatIdx < teamA.players.length) {
      setOnStrikeIdx(nextBatIdx);
      setNextBatIdx((i) => i + 1);
    }

    if ((balls + 1) % 6 === 0) updateOver();
  };

  const requiredRunRate =
    isChasing && balls < 120
      ? (((target - runs) / ((120 - balls) || 1)) * 6).toFixed(2)
      : null;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-center text-indigo-700 mb-2">
        {teamA.name} Batting {isChasing && target ? `(Target: ${target})` : ""}
      </h2>

      <div className="grid grid-cols-3 gap-4 text-center text-lg font-semibold my-4">
        <div>
          <p className="text-gray-500">Runs</p>
          <p>{runs}</p>
        </div>
        <div>
          <p className="text-gray-500">Wickets</p>
          <p>{wickets}</p>
        </div>
        <div>
          <p className="text-gray-500">Overs</p>
          <p>{overs}</p>
        </div>
      </div>

      {isChasing && requiredRunRate && (
        <div className="text-center text-sm text-gray-600 mb-2">
          Required Run Rate: <span className="font-medium text-red-600">{requiredRunRate}</span>
        </div>
      )}

      <PlayerStats
        striker={battingStats[onStrikeIdx]}
        nonStriker={battingStats[nonStrikeIdx]}
        bowler={bowlingStats[bowlerIdx]}
        bowlerName={teamB.players[bowlerIdx]}
      />

      <ScoreControls onRun={handleRun} onWicket={handleWicket} />

      <BattingTable battingStats={battingStats} />

      <RunRateChart runsPerOver={runsPerOver} />

      <BowlingTable bowlingStats={bowlingStats} playerNames={teamB.players} />
    </div>
  );
}

export default Scorecard;
