export default function InningsTransition({ state, overRuns, onContinue }) {
  const inn1 = state.innings[0];
  const score = inn1 ? inn1.overs.reduce((s, o) => s + overRuns(o.balls), 0) : 0;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 text-center">
      <div className="text-5xl mb-4">🏏</div>
      <h2 className="text-white text-2xl font-bold mb-2">Innings Complete!</h2>
      <p className="text-slate-400 mb-6">
        {state.team1} scored <span className="text-green-400 font-bold text-xl">{score}</span> runs
      </p>
      <div className="bg-slate-800 rounded-2xl p-5 w-full max-w-xs mb-8">
        <div className="text-slate-400 text-sm mb-1">Now batting</div>
        <div className="text-white font-bold text-xl">{state.team2}</div>
        <div className="text-yellow-400 text-sm mt-2">Target: {score + 1}</div>
      </div>
      <button
        onClick={onContinue}
        className="w-full max-w-xs bg-green-500 text-white font-bold text-lg rounded-2xl py-4 active:bg-green-600"
      >
        Start 2nd Innings
      </button>
    </div>
  );
}
