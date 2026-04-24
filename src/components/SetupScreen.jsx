import { useState } from 'react';

export default function SetupScreen({ onStart }) {
  const [team1, setTeam1] = useState('Team 1');
  const [team2, setTeam2] = useState('Team 2');
  const [overs, setOvers] = useState('5');

  function handleSubmit(e) {
    e.preventDefault();
    const n = parseInt(overs, 10);
    if (!n || n < 1) return;
    onStart(team1.trim() || 'Team 1', team2.trim() || 'Team 2', n);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🏏</div>
          <h1 className="text-3xl font-bold text-white">Cricket Tracker</h1>
          <p className="text-slate-400 mt-2 text-sm">Street cricket scorer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Batting First</label>
            <input
              type="text"
              value={team1}
              onChange={e => setTeam1(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 text-base focus:outline-none focus:border-green-500"
              placeholder="Team 1"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Batting Second</label>
            <input
              type="text"
              value={team2}
              onChange={e => setTeam2(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 text-base focus:outline-none focus:border-green-500"
              placeholder="Team 2"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Overs per side</label>
            <div className="flex gap-2 flex-wrap">
              {[3, 5, 6, 8, 10, 12, 20].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setOvers(String(n))}
                  className={`px-4 py-2 rounded-xl text-base font-semibold transition-colors ${
                    overs === String(n)
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {n}
                </button>
              ))}
              <input
                type="number"
                min="1"
                max="50"
                value={overs}
                onChange={e => setOvers(e.target.value)}
                className="w-20 bg-slate-800 border border-slate-600 text-white rounded-xl px-3 py-2 text-base focus:outline-none focus:border-green-500"
                placeholder="—"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-bold text-lg rounded-2xl py-4 mt-2 transition-colors"
          >
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
}
