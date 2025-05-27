import React from "react";

function ScoreControls({
  onRun,
  onWicket,
  onNoBall,
  onWide,
  onDot,
  onUndo,
  onRotateStrike,
}) {
  return (
    <div className="cricket-card">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-center">
        {/* Run Buttons */}
        <button 
          onClick={() => onRun(1)} 
          className="btn-primary flex flex-col items-center py-3"
        >
          <span className="text-xl">1</span>
          <span className="text-xs mt-1">Run</span>
        </button>
        <button 
          onClick={() => onRun(2)} 
          className="btn-primary flex flex-col items-center py-3"
        >
          <span className="text-xl">2</span>
          <span className="text-xs mt-1">Runs</span>
        </button>
        <button 
          onClick={() => onRun(3)} 
          className="btn-primary flex flex-col items-center py-3"
        >
          <span className="text-xl">3</span>
          <span className="text-xs mt-1">Runs</span>
        </button>
        <button 
          onClick={() => onRun(4)} 
          className="bg-green-600 hover:bg-green-700 text-white flex flex-col items-center py-3 rounded"
        >
          <span className="text-xl">4</span>
          <span className="text-xs mt-1">Runs</span>
        </button>
        <button 
          onClick={() => onRun(6)} 
          className="bg-yellow-600 hover:bg-yellow-700 text-white flex flex-col items-center py-3 rounded"
        >
          <span className="text-xl">6</span>
          <span className="text-xs mt-1">Runs</span>
        </button>

        {/* Special Buttons */}
        <button 
          onClick={onDot} 
          className="bg-gray-600 hover:bg-gray-700 text-white flex flex-col items-center py-3 rounded"
        >
          <span className="text-xl">•</span>
          <span className="text-xs mt-1">Dot</span>
        </button>
        <button 
          onClick={onWicket} 
          className="bg-red-600 hover:bg-red-700 text-white flex flex-col items-center py-3 rounded"
        >
          <span className="text-xl">W</span>
          <span className="text-xs mt-1">Wicket</span>
        </button>
        <button 
          onClick={onNoBall} 
          className="bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center py-3 rounded"
        >
          <span className="text-xl">NB</span>
          <span className="text-xs mt-1">No Ball</span>
        </button>
        <button 
          onClick={onWide} 
          className="bg-pink-600 hover:bg-pink-700 text-white flex flex-col items-center py-3 rounded"
        >
          <span className="text-xl">WD</span>
          <span className="text-xs mt-1">Wide</span>
        </button>
        <button 
          onClick={onRotateStrike} 
          className="bg-blue-500 hover:bg-blue-600 text-white flex flex-col items-center py-3 rounded"
        >
          <span className="text-xl">🔄</span>
          <span className="text-xs mt-1">Rotate</span>
        </button>

        {/* Undo Button */}
        <button 
          onClick={onUndo} 
          className="bg-gray-800 hover:bg-gray-900 text-white col-span-3 sm:col-span-5 py-2 rounded flex items-center justify-center gap-2"
        >
          <span>↩️</span>
          <span>Undo Last Action</span>
        </button>
      </div>
    </div>
  );
}

export default ScoreControls;