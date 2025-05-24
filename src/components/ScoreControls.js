import React from "react";

function ScoreControls({ onRun, onWicket }) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {[1, 2, 3, 4, 6].map((n) => (
        <button
          key={n}
          onClick={() => onRun(n)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          +{n}
        </button>
      ))}
      <button
        onClick={onWicket}
        className="col-span-3 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
      >
        Wicket
      </button>
    </div>
  );
}

export default ScoreControls;
