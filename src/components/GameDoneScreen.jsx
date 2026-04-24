export default function GameDoneScreen({ state, overRuns, overWickets, onNewGame, onShowOverview }) {
  const inn1 = state.innings[0];
  const inn2 = state.innings[1];
  const score1 = inn1 ? inn1.overs.reduce((s, o) => s + overRuns(o.balls), 0) : 0;
  const score2 = inn2 ? inn2.overs.reduce((s, o) => s + overRuns(o.balls), 0) : 0;
  const wickets1 = inn1 ? inn1.overs.reduce((s, o) => s + overWickets(o.balls), 0) : 0;
  const wickets2 = inn2 ? inn2.overs.reduce((s, o) => s + overWickets(o.balls), 0) : 0;

  let result;
  if (score1 > score2) result = `${state.team1} wins by ${score1 - score2} runs!`;
  else if (score2 > score1) result = `${state.team2} wins by ${score2 - score1} runs!`;
  else result = "It's a tie!";

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-4">🏆</div>
      <h1 className="text-white text-2xl font-bold mb-6">Game Over</h1>

      <div className="bg-slate-800 rounded-2xl p-5 w-full max-w-xs mb-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-300 font-medium">{state.team1}</span>
          <span className="text-green-400 font-bold text-xl">
            {score1}
            <span className="text-slate-400 font-semibold text-base">/{wickets1}</span>
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300 font-medium">{state.team2}</span>
          <span className="text-green-400 font-bold text-xl">
            {score2}
            <span className="text-slate-400 font-semibold text-base">/{wickets2}</span>
          </span>
        </div>
      </div>

      <p className="text-yellow-300 font-bold text-lg mb-8">{result}</p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onShowOverview}
          className="w-full bg-slate-700 text-white font-semibold rounded-2xl py-4 active:bg-slate-600"
        >
          View Scorecard
        </button>
        <button
          onClick={onNewGame}
          className="w-full bg-green-500 text-white font-bold text-lg rounded-2xl py-4 active:bg-green-600"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
