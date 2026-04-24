import OverStrip from './OverStrip';

export default function OverviewScreen({
  state,
  currentOvers,
  legalCount,
  overRuns,
  overWides,
  overNoBalls,
  battingTeamName,
  onBack,
}) {
  const innings = state.innings[state.currentInnings];
  const allOvers = innings ? innings.overs : [];
  const totalRuns = allOvers.reduce((s, o) => s + overRuns(o.balls), 0);

  // Also show previous innings if in innings2 or done
  const prevInnings = state.currentInnings === 1 || state.phase === 'done'
    ? state.innings[0]
    : null;
  const prevTeamName = state.team1;
  const prevTotalRuns = prevInnings
    ? prevInnings.overs.reduce((s, o) => s + overRuns(o.balls), 0)
    : 0;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={onBack}
            className="text-slate-400 text-2xl leading-none active:text-white"
          >
            ←
          </button>
          <h1 className="text-white text-xl font-bold">Overview</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-6 pt-5">
        {/* Previous innings */}
        {prevInnings && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-slate-300 font-semibold text-base">{prevTeamName}</h2>
              <span className="text-green-400 font-bold text-lg">{prevTotalRuns}</span>
            </div>
            <div className="space-y-3">
              {prevInnings.overs.map((over, i) => (
                <OverStrip
                  key={i}
                  balls={over.balls}
                  legalCount={legalCount}
                  overRuns={overRuns}
                  overWides={overWides}
                  overNoBalls={overNoBalls}
                  overNumber={i + 1}
                  totalOvers={state.overs}
                />
              ))}
            </div>
          </section>
        )}

        {/* Current innings */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-slate-300 font-semibold text-base">
              {battingTeamName}
              {state.phase !== 'done' && (
                <span className="ml-2 text-xs bg-green-800 text-green-300 px-2 py-0.5 rounded-full">Live</span>
              )}
            </h2>
            <span className="text-green-400 font-bold text-lg">{totalRuns}</span>
          </div>
          <div className="space-y-3">
            {allOvers.length === 0 && (
              <p className="text-slate-500 text-sm">No overs yet.</p>
            )}
            {allOvers.map((over, i) => (
              <OverStrip
                key={i}
                balls={over.balls}
                legalCount={legalCount}
                overRuns={overRuns}
                overWides={overWides}
                overNoBalls={overNoBalls}
                overNumber={i + 1}
                totalOvers={state.overs}
              />
            ))}
          </div>
        </section>

        {state.phase === 'done' && (
          <div className="bg-green-900 border border-green-700 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-white font-bold text-lg">Game Complete</div>
            {(() => {
              const s1 = prevInnings ? prevTotalRuns : 0;
              const s2 = totalRuns;
              if (s1 === s2) return <p className="text-slate-300 mt-1">It's a tie!</p>;
              const winner = s1 > s2 ? prevTeamName : battingTeamName;
              return <p className="text-green-300 mt-1">{winner} wins!</p>;
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
