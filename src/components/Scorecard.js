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
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showBatsmanModal, setShowBatsmanModal] = useState(false);
  const [newBowler, setNewBowler] = useState("");
  const [newBatsman, setNewBatsman] = useState("");
  const currentOverRuns = useRef(0);
  const currentOverBalls = useRef([]);
  const [history, setHistory] = useState([]);

  // Save current state to history before making changes
  const saveToHistory = () => {
    setHistory(prev => [
      ...prev,
      {
        matchData: { 
          ...matchData,
          battingStats: [...matchData.battingStats],
          bowlingStats: [...matchData.bowlingStats],
          runsPerOver: [...matchData.runsPerOver],
          ballLog: [...matchData.ballLog]
        },
        currentOverRuns: currentOverRuns.current,
        currentOverBalls: [...currentOverBalls.current],
        freeHit
      }
    ]);
  };

  const undoLastAction = () => {
    if (history.length === 0) return;
    
    const lastState = history[history.length - 1];
    setMatchData(lastState.matchData);
    currentOverRuns.current = lastState.currentOverRuns;
    currentOverBalls.current = [...lastState.currentOverBalls];
    setFreeHit(lastState.freeHit);
    setHistory(prev => prev.slice(0, -1));
  };

  const updateOver = () => {
    saveToHistory();
    
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
        updateOver();
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

  const availableBowlers = teamB.players.filter(
    (_, idx) => !bowlingStats.some(b => b.name === teamB.players[idx]) || 
               bowlingStats[0].name === teamB.players[idx]
  );

  const availableBatsmen = teamA.players.filter(
    (_, idx) => !battingStats.some(b => b.name === teamA.players[idx] && !b.out) ||
               [battingStats[0]?.name, battingStats[1]?.name].includes(teamA.players[idx])
  );

  const rotateStrike = () => {
    saveToHistory();
    const newBattingStats = [...battingStats];
    [newBattingStats[0], newBattingStats[1]] = [newBattingStats[1], newBattingStats[0]];
    setMatchData(prev => ({ ...prev, battingStats: newBattingStats }));
  };

  const changeBowler = () => {
    if (!newBowler) return;
    saveToHistory();
    
    setMatchData(prev => {
      const newBowlingStats = [...prev.bowlingStats];
      const existingBowlerIndex = newBowlingStats.findIndex(b => b.name === newBowler);
      
      if (existingBowlerIndex > 0) {
        const [bowler] = newBowlingStats.splice(existingBowlerIndex, 1);
        newBowlingStats.unshift(bowler);
      } else if (existingBowlerIndex === -1) {
        newBowlingStats.unshift({
          name: newBowler,
          balls: 0,
          runsConceded: 0,
          wickets: 0,
          maidens: 0
        });
      }

      return { ...prev, bowlingStats: newBowlingStats };
    });

    setShowBowlerModal(false);
    setNewBowler("");
  };

  const changeBatsman = () => {
    if (!newBatsman) return;
    saveToHistory();
    
    setMatchData(prev => {
      const newBattingStats = [...prev.battingStats];
      const newPlayer = {
        name: newBatsman,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        out: false
      };
      
      const outIndex = newBattingStats.findIndex(p => p.out);
      if (outIndex >= 0) {
        newBattingStats[outIndex] = newPlayer;
      } else {
        newBattingStats.push(newPlayer);
      }

      return { ...prev, battingStats: newBattingStats };
    });

    setShowBatsmanModal(false);
    setNewBatsman("");
  };

  const handleRun = (r) => {
    if (checkEndConditions()) return;
    saveToHistory();

    setMatchData(prev => {
      const newBat = [...prev.battingStats];
      const newBowl = [...prev.bowlingStats];

      newBat[0] = {
        ...newBat[0],
        runs: newBat[0].runs + r,
        balls: newBat[0].balls + 1,
        fours: r === 4 ? (newBat[0].fours || 0) + 1 : newBat[0].fours,
        sixes: r === 6 ? (newBat[0].sixes || 0) + 1 : newBat[0].sixes
      };

      newBowl[0] = {
        ...newBowl[0],
        runsConceded: newBowl[0].runsConceded + r,
        balls: newBowl[0].balls + 1
      };

      const tag = freeHit ? `${r}*` : r;
      currentOverRuns.current += r;
      currentOverBalls.current.push(tag);

      return {
        ...prev,
        runs: prev.runs + r,
        balls: prev.balls + 1,
        battingStats: newBat,
        bowlingStats: newBowl
      };
    });

    if (r % 2 !== 0 || (balls + 1) % 6 === 0) rotateStrike();
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
    saveToHistory();

    setMatchData(prev => {
      const newBat = [...prev.battingStats];
      const newBowl = [...prev.bowlingStats];

      newBat[prev.wickets] = {
        ...newBat[prev.wickets],
        out: true,
        balls: newBat[prev.wickets].balls + 1
      };

      newBowl[0] = {
        ...newBowl[0],
        wickets: newBowl[0].wickets + 1,
        balls: newBowl[0].balls + 1
      };

      currentOverBalls.current.push("W");

      return {
        ...prev,
        wickets: prev.wickets + 1,
        balls: prev.balls + 1,
        battingStats: newBat,
        bowlingStats: newBowl
      };
    });

    if ((balls + 1) % 6 === 0) updateOver();
    setShowBatsmanModal(true);
  };

  const handleNoBall = () => {
    saveToHistory();
    setMatchData(prev => {
      const newBowl = [...prev.bowlingStats];
      newBowl[0] = {
        ...newBowl[0],
        runsConceded: newBowl[0].runsConceded + 1
      };

      currentOverBalls.current.push("NB");

      return {
        ...prev,
        runs: prev.runs + 1,
        bowlingStats: newBowl
      };
    });

    setFreeHit(true);
  };

  const handleWide = () => {
    saveToHistory();
    setMatchData(prev => {
      const newBowl = [...prev.bowlingStats];
      newBowl[0] = {
        ...newBowl[0],
        runsConceded: newBowl[0].runsConceded + 1
      };

      currentOverBalls.current.push("WD");

      return {
        ...prev,
        runs: prev.runs + 1,
        bowlingStats: newBowl
      };
    });
  };

  const handleDot = () => {
    saveToHistory();
    handleRun(0);
  };

  const requiredRunRate = isChasing && balls < oversLimit * 6
    ? (((target - runs) / ((oversLimit * 6 - balls) || 1)) * 6).toFixed(2)
    : null;

  const runsNeeded = isChasing ? target - runs : null;
  const ballsRemaining = isChasing ? oversLimit * 6 - balls : null;

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {teamA.name} vs {teamB.name}
        </h2>
        <button 
          onClick={undoLastAction}
          disabled={history.length === 0}
          className={`px-4 py-2 rounded ${
            history.length === 0 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          Undo Last Action
        </button>
      </div>

      {/* Score Display */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-gray-600">Runs</p>
          <p className="text-3xl font-bold text-blue-700">{runs}</p>
        </div>
        <div className="bg-red-50 p-3 rounded">
          <p className="text-gray-600">Wickets</p>
          <p className="text-3xl font-bold text-red-700">{wickets}</p>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <p className="text-gray-600">Overs</p>
          <p className="text-3xl font-bold text-green-700">{overs}</p>
        </div>
      </div>

      {/* Match Info */}
      {freeHit && (
        <div className="text-center text-sm font-bold text-white bg-green-500 py-2 rounded mb-4 animate-pulse">
          🟢 FREE HIT!
        </div>
      )}

      {isChasing && (
        <div className="text-center text-sm bg-blue-100 text-blue-800 p-3 rounded-lg mb-4">
          <p className="font-bold">🏹 Target: {target} | Need {runsNeeded} in {ballsRemaining} balls</p>
          {requiredRunRate && (
            <p className="mt-1">Required Run Rate: <span className="font-bold">{requiredRunRate}</span></p>
          )}
        </div>
      )}

      {/* Player Stats */}
      <PlayerStats
        striker={battingStats[0]}
        nonStriker={battingStats[1]}
        bowler={bowlingStats[0]}
        onBowlerChange={() => setShowBowlerModal(true)}
        onBatsmanChange={() => setShowBatsmanModal(true)}
      />

      {/* Score Controls */}
      <ScoreControls
        onRun={handleRun}
        onWicket={handleWicket}
        onNoBall={handleNoBall}
        onWide={handleWide}
        onDot={handleDot}
        onUndo={undoLastAction}
        onRotateStrike={rotateStrike}
      />

      {/* Bowler Change Modal */}
      {showBowlerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Change Bowler</h3>
            <select
              className="w-full p-3 border rounded mb-4"
              value={newBowler}
              onChange={(e) => setNewBowler(e.target.value)}
            >
              <option value="">Select new bowler</option>
              {availableBowlers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowBowlerModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={changeBowler}
                disabled={!newBowler}
              >
                Change Bowler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batsman Change Modal */}
      {showBatsmanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Change Batsman</h3>
            <select
              className="w-full p-3 border rounded mb-4"
              value={newBatsman}
              onChange={(e) => setNewBatsman(e.target.value)}
            >
              <option value="">Select new batsman</option>
              {availableBatsmen.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowBatsmanModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={changeBatsman}
                disabled={!newBatsman}
              >
                Change Batsman
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scorecards */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <BattingTable battingStats={battingStats} />
        <BowlingTable bowlingStats={bowlingStats} playerNames={teamB.players} />
      </div>

      <RunRateChart runsPerOver={runsPerOver} />

      {/* Ball Log */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-3">Ball-by-Ball</h3>
        <div className="flex flex-wrap gap-2">
          {ballLog.map((over, i) => (
            <div key={i} className="bg-gray-100 px-3 py-1 rounded-full">
              <span className="font-medium">Over {i + 1}:</span> {over.join(" ")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Scorecard;