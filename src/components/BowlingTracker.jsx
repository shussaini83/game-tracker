import { useState } from 'react';
import OverStrip from './OverStrip';

const RUN_BUTTONS = [0, 1, 2, 3, 4, 5, 6];

export default function BowlingTracker({
  state,
  currentOver,
  currentOvers,
  completedOversCount,
  isCurrentOverComplete,
  battingTeamName,
  bowlingTeamName,
  recordBall,
  startNextOver,
  undoLastBall,
  legalCount,
  overRuns,
  overWides,
  overNoBalls,
  onShowOverview,
  onNewGame,
}) {
  const [isNoBall, setIsNoBall] = useState(false);
  const [isWide, setIsWide] = useState(false);

  function handleRun(runs) {
    recordBall(runs, isWide, isNoBall);
    setIsNoBall(false);
    setIsWide(false);
  }

  const innings = state.innings[state.currentInnings];
  const totalInningsRuns = innings
    ? innings.overs.reduce((s, o) => s + overRuns(o.balls), 0)
    : 0;

  const overNumber = currentOvers.length;
  const totalOvers = state.overs;
  const phase = state.phase;

  // innings2: show target
  const inn1 = state.innings[0];
  const target = inn1
    ? inn1.overs.reduce((s, o) => s + overRuns(o.balls), 0)
    : 0;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 px-4 pt-12 pb-4 safe-top">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Batting</div>
            <div className="text-white font-bold text-xl">{battingTeamName}</div>
            {phase === 'innings2' && (
              <div className="text-yellow-400 text-xs mt-1">Target: {target + 1}</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Score</div>
            <div className="text-green-400 font-bold text-3xl">{totalInningsRuns}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onShowOverview}
            className="flex-1 bg-slate-700 text-slate-300 text-sm rounded-xl py-2 font-medium active:bg-slate-600"
          >
            Overview
          </button>
          <button
            onClick={onNewGame}
            className="flex-1 bg-slate-700 text-slate-300 text-sm rounded-xl py-2 font-medium active:bg-slate-600"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Current over strip */}
      <div className="px-4 pt-4">
        <OverStrip
          balls={currentOver.balls}
          legalCount={legalCount}
          overRuns={overRuns}
          overWides={overWides}
          overNoBalls={overNoBalls}
          overNumber={overNumber}
          totalOvers={totalOvers}
        />
      </div>

      {/* Controls */}
      <div className="px-4 pt-5 pb-8 space-y-4">
        {isCurrentOverComplete ? (
          /* Over complete — show next over CTA */
          <div className="space-y-3">
            <div className="bg-slate-700 rounded-2xl py-3 text-center text-slate-300 text-sm font-medium">
              Over complete
            </div>
            <button
              onClick={startNextOver}
              className="w-full bg-green-500 text-white font-bold text-xl rounded-2xl py-6 active:bg-green-600"
            >
              Next Over →
            </button>
            <button
              onClick={undoLastBall}
              className="w-full rounded-2xl py-4 text-base font-bold bg-slate-600 text-slate-300 active:bg-slate-500"
            >
              ↩ Undo last ball
            </button>
          </div>
        ) : (
          <>
            {/* Modifiers */}
            <div className="flex gap-3">
              <button
                onClick={() => { setIsNoBall(v => !v); setIsWide(false); }}
                className={`flex-1 rounded-2xl py-4 text-base font-bold transition-colors ${
                  isNoBall
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-700 text-slate-300 border border-slate-600'
                }`}
              >
                No Ball
              </button>
              <button
                onClick={() => { setIsWide(v => !v); setIsNoBall(false); }}
                className={`flex-1 rounded-2xl py-4 text-base font-bold transition-colors ${
                  isWide
                    ? 'bg-yellow-500 text-slate-900'
                    : 'bg-slate-700 text-slate-300 border border-slate-600'
                }`}
              >
                Wide
              </button>
            </div>

            {/* Active modifier label */}
            {(isNoBall || isWide) && (
              <div className={`text-center text-sm font-semibold rounded-xl py-2 ${
                isNoBall ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'
              }`}>
                {isNoBall ? 'No Ball — tap runs scored' : 'Wide — tap runs scored (0 = just wide)'}
              </div>
            )}

            {/* Run buttons */}
            <div className="grid grid-cols-4 gap-3">
              {RUN_BUTTONS.map(r => (
                <button
                  key={r}
                  onClick={() => handleRun(r)}
                  className={`rounded-2xl py-5 text-2xl font-bold transition-colors active:scale-95 ${
                    r === 4
                      ? 'bg-blue-600 text-white col-span-1'
                      : r === 6
                      ? 'bg-purple-600 text-white col-span-1'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
              <button
                onClick={undoLastBall}
                className="rounded-2xl py-5 text-xl font-bold bg-slate-600 text-slate-300 active:bg-slate-500"
              >
                ↩
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
