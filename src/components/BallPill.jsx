export default function BallPill({ ball }) {
  if (ball.isWide) {
    return (
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-yellow-500 text-slate-900 text-xs font-bold">
        W{ball.runs > 0 ? `+${ball.runs}` : ''}
      </span>
    );
  }
  if (ball.isNoBall) {
    return (
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-500 text-white text-xs font-bold">
        NB{ball.runs > 0 ? `+${ball.runs}` : ''}
      </span>
    );
  }
  const runColors = {
    0: 'bg-slate-600 text-slate-300',
    4: 'bg-blue-500 text-white',
    6: 'bg-purple-500 text-white',
  };
  const color = runColors[ball.runs] ?? 'bg-slate-500 text-white';
  return (
    <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full ${color} text-sm font-bold`}>
      {ball.runs}
    </span>
  );
}
