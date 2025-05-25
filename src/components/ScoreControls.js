import React from "react";

function ScoreControls({
  onRun,
  onWicket,
  onNoBall,
  onWide,
  onDot,
  onUndo,
}) {
  return (
    <div className="my-6 grid grid-cols-3 sm:grid-cols-4 gap-3 text-center text-white font-medium">
      <button onClick={() => onRun(1)} className="bg-blue-600 py-2 rounded">1 Run</button>
      <button onClick={() => onRun(2)} className="bg-blue-600 py-2 rounded">2 Runs</button>
      <button onClick={() => onRun(3)} className="bg-blue-600 py-2 rounded">3 Runs</button>
      <button onClick={() => onRun(4)} className="bg-green-600 py-2 rounded">4 Runs</button>
      <button onClick={() => onRun(6)} className="bg-yellow-600 py-2 rounded">6 Runs</button>
      <button onClick={onDot} className="bg-gray-500 py-2 rounded">Dot Ball</button>
      <button onClick={onWicket} className="bg-red-600 py-2 rounded">Wicket</button>
      <button onClick={onNoBall} className="bg-purple-600 py-2 rounded">No Ball</button>
      <button onClick={onWide} className="bg-pink-600 py-2 rounded">Wide</button>
      <button onClick={onUndo} className="bg-black py-2 rounded col-span-3 sm:col-span-1">Undo</button>
    </div>
  );
}

export default ScoreControls;
