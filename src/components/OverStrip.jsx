import BallPill from './BallPill';

export default function OverStrip({ balls, legalCount, overRuns, overWides, overNoBalls, overWickets, overNumber, totalOvers }) {
  const legal = legalCount(balls);
  const runs = overRuns(balls);
  const wides = overWides(balls);
  const noBalls = overNoBalls(balls);
  const wickets = overWickets(balls);

  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm font-medium">
          Over {overNumber}{totalOvers ? ` / ${totalOvers}` : ''}
        </span>
        <span className="text-white font-bold text-lg">{runs} runs</span>
      </div>

      {/* Balls row */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {balls.map((ball, i) => (
          <BallPill key={i} ball={ball} />
        ))}
        {/* Empty slots for remaining legal balls */}
        {Array.from({ length: Math.max(0, 6 - legal) }).map((_, i) => (
          <span key={`empty-${i}`} className="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-dashed border-slate-600 text-slate-600 text-sm">
            ·
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex gap-4 text-sm">
        <span className="text-slate-400">
          <span className="text-white font-semibold">{legal}</span>/6 balls
        </span>
        {wides > 0 && (
          <span className="text-yellow-400">
            <span className="font-semibold">{wides}</span> wide{wides !== 1 ? 's' : ''}
          </span>
        )}
        {noBalls > 0 && (
          <span className="text-red-400">
            <span className="font-semibold">{noBalls}</span> no ball{noBalls !== 1 ? 's' : ''}
          </span>
        )}
        {wickets > 0 && (
          <span className="text-orange-400">
            <span className="font-semibold">{wickets}</span> wicket{wickets !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}
