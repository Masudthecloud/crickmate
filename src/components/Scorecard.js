import React, { useState, useRef } from "react";
import PlayerStats from "./PlayerStats";
import ScoreControls from "./ScoreControls";
import BattingTable from "./BattingTable";
import BowlingTable from "./BowlingTable";
import RunRateChart from "./RunRateChart";

function Scorecard({
  teamA,
  teamB,
  matchData,
  setMatchData,
  onInningsComplete,
  isChasing = false,
  target = null,
}) {
  const {
    runs,
    wickets,
    balls,
    oversLimit,
    battingStats,
    bowlingStats,
    runsPerOver,
    ballLog,
  } = matchData;

  const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
  const [freeHit, setFreeHit] = useState(false);
  const [history, setHistory] = useState([]);
  const currentOverRuns = useRef(0);
  const currentOverBalls = useRef([]);

  const updateOver = () => {
    const updatedOvers = [...runsPerOver, currentOverRuns.current];
    const updatedBallLog = [...ballLog, currentOverBalls.current];

    currentOverRuns.current = 0;
    currentOverBalls.current = [];

    setMatchData((prev) => ({
      ...prev,
      runsPerOver: updatedOvers,
      ballLog: updatedBallLog,
    }));
  };

  const checkEndConditions = (isLegalDelivery = true) => {
    const totalBalls = balls + (isLegalDelivery ? 1 : 0);
    const isAllOut = wickets >= teamA.players.length - 1;
    const isOversLimitReached = totalBalls >= oversLimit * 6;
    const targetReached = isChasing && runs >= target;

    if (isAllOut || isOversLimitReached || targetReached) {
      if (isLegalDelivery && (balls + 1) % 6 === 0) {
        updateOver(); // complete last over if needed
      }

      onInningsComplete({
        totalRuns: runs,
        balls: totalBalls,
        battingStats,
        bowlingStats,
        runsPerOver: [...runsPerOver, currentOverRuns.current],
      });
      return true;
    }
    return false;
  };

  const handleRun = (r) => {
    if (checkEndConditions()) return;

    const newBat = [...battingStats];
    const newBowl = [...bowlingStats];

    newBat[0].runs += r;
    newBat[0].balls += 1;
    newBowl[0].runsConceded += r;
    newBowl[0].balls += 1;

    const tag = freeHit ? `${r}*` : r;
    currentOverRuns.current += r;
    currentOverBalls.current.push(tag);

    setMatchData({
      ...matchData,
      runs: runs + r,
      balls: balls + 1,
      battingStats: newBat,
      bowlingStats: newBowl,
    });

    setHistory((prev) => [...prev, { type: "run", value: r }]);

    if ((balls + 1) % 6 === 0) updateOver();
    setFreeHit(false);
  };

  const handleWicket = () => {
    if (freeHit) {
      currentOverBalls.current.push("W*");
      setFreeHit(false);
      return;
    }

    if (checkEndConditions()) return;

    const newBat = [...battingStats];
    const newBowl = [...bowlingStats];

    newBat[wickets].out = true;
    newBat[wickets].balls += 1;
    newBowl[0].wickets += 1;
    newBowl[0].balls += 1;

    currentOverBalls.current.push("W");

    setMatchData({
      ...matchData,
      wickets: wickets + 1,
      balls: balls + 1,
      battingStats: newBat,
      bowlingStats: newBowl,
    });

    setHistory((prev) => [...prev, { type: "wicket" }]);

    if ((balls + 1) % 6 === 0) updateOver();
  };

  const handleNoBall = () => {
    const newBowl = [...bowlingStats];
    newBowl[0].runsConceded += 1;
    currentOverBalls.current.push("NB");

    setMatchData({
      ...matchData,
      runs: runs + 1,
      bowlingStats: newBowl,
    });

    setFreeHit(true);
    setHistory((prev) => [...prev, { type: "noball" }]);
  };

  const handleWide = () => {
    const newBowl = [...bowlingStats];
    newBowl[0].runsConceded += 1;
    currentOverBalls.current.push("WD");

    setMatchData({
      ...matchData,
      runs: runs + 1,
      bowlingStats: newBowl,
    });

    setHistory((prev) => [...prev, { type: "wide" }]);
  };

  const handleDot = () => handleRun(0);

  const undoLastAction = () => {
    const last = history.pop();
    if (!last) return;

    const newBat = [...battingStats];
    const newBowl = [...bowlingStats];

    switch (last.type) {
      case "run":
        newBat[0].runs -= last.value;
        newBat[0].balls -= 1;
        newBowl[0].runsConceded -= last.value;
        newBowl[0].balls -= 1;
        setMatchData({
          ...matchData,
          runs: runs - last.value,
          balls: balls - 1,
          battingStats: newBat,
          bowlingStats: newBowl,
        });
        break;

      case "wicket":
        newBat[wickets - 1].out = false;
        newBat[wickets - 1].balls -= 1;
        newBowl[0].wickets -= 1;
        newBowl[0].balls -= 1;
        setMatchData({
          ...matchData,
          wickets: wickets - 1,
          balls: balls - 1,
          battingStats: newBat,
          bowlingStats: newBowl,
        });
        break;

      case "noball":
        newBowl[0].runsConceded -= 1;
        setMatchData({
          ...matchData,
          runs: runs - 1,
          bowlingStats: newBowl,
        });
        setFreeHit(false);
        break;

      case "wide":
        newBowl[0].runsConceded -= 1;
        setMatchData({
          ...matchData,
          runs: runs - 1,
          bowlingStats: newBowl,
        });
        break;

      default:
        break;
    }

    setHistory([...history]);
  };

  const requiredRunRate =
    isChasing && balls < oversLimit * 6
      ? (((target - runs) / ((oversLimit * 6 - balls) || 1)) * 6).toFixed(2)
      : null;

  const runsNeeded = isChasing ? target - runs : null;
  const ballsRemaining = isChasing ? oversLimit * 6 - balls : null;

  return (
    <div className="p-4 max-w-3xl mx-auto">
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

      {freeHit && (
        <div className="text-center text-sm font-bold text-green-600 mb-2">
          🟢 FREE HIT!
        </div>
      )}

      {isChasing && (
        <div className="text-center text-sm text-blue-700 mb-2">
          🏹 {runsNeeded} runs needed in {ballsRemaining} balls
        </div>
      )}

      {isChasing && requiredRunRate && (
        <div className="text-center text-sm text-gray-600 mb-2">
          Required Run Rate:{" "}
          <span className="font-medium text-red-600">{requiredRunRate}</span>
        </div>
      )}

      <PlayerStats
        striker={battingStats[0]}
        nonStriker={battingStats[1]}
        bowler={bowlingStats[0]}
        bowlerName={teamB.players[0]}
      />

      <ScoreControls
        onRun={handleRun}
        onWicket={handleWicket}
        onNoBall={handleNoBall}
        onWide={handleWide}
        onDot={handleDot}
        onUndo={undoLastAction}
      />

      <BattingTable battingStats={battingStats} />
      <RunRateChart runsPerOver={runsPerOver} />
      <BowlingTable bowlingStats={bowlingStats} playerNames={teamB.players} />

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-center">
          Over-by-Over Ball Log
        </h3>
        {ballLog.map((over, i) => (
          <p key={i} className="text-center text-sm text-gray-700">
            Over {i + 1}: {over.join(" ")}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Scorecard;
