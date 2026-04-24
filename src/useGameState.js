import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cricket-tracker-v1';

const emptyOver = () => ({ balls: [] });

// A ball: { runs, isWide, isNoBall, isOut }
// Legal ball = not wide and not no-ball
function isLegal(ball) {
  return !ball.isWide && !ball.isNoBall;
}

function legalCount(balls) {
  return balls.filter(isLegal).length;
}

function overRuns(balls) {
  return balls.reduce((s, b) => s + b.runs, 0);
}

function overWides(balls) {
  return balls.filter(b => b.isWide).length;
}

function overNoBalls(balls) {
  return balls.filter(b => b.isNoBall).length;
}

function overWickets(balls) {
  return balls.filter(b => b.isOut).length;
}

function isOverComplete(balls, totalOversPerSide) {
  return legalCount(balls) >= 6;
}

const defaultState = () => ({
  phase: 'setup', // 'setup' | 'innings1' | 'innings2' | 'done'
  overs: 5,
  team1: 'Team 1',
  team2: 'Team 2',
  innings: [
    { teamIndex: 0, overs: [] },
    { teamIndex: 1, overs: [] },
  ],
  currentInnings: 0,
});

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return defaultState();
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useGameState() {
  const [state, setStateRaw] = useState(load);

  function setState(updater) {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      save(next);
      return next;
    });
  }

  const innings = state.innings[state.currentInnings];

  // Current over is last in the innings array, or empty if none
  const currentOverIndex = innings ? Math.max(0, innings.overs.length - 1) : 0;
  const currentOver = innings && innings.overs.length > 0
    ? innings.overs[innings.overs.length - 1]
    : emptyOver();

  function startGame(team1, team2, overs) {
    setState({
      phase: 'innings1',
      overs: Number(overs),
      team1,
      team2,
      innings: [
        { teamIndex: 0, overs: [emptyOver()] },
        { teamIndex: 1, overs: [emptyOver()] },
      ],
      currentInnings: 0,
    });
  }

  function recordBall(runs, isWide, isNoBall, isOut = false) {
    setState(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const inn = next.innings[next.currentInnings];
      if (!inn.overs.length) inn.overs.push(emptyOver());
      const over = inn.overs[inn.overs.length - 1];
      // Don't add to an already-complete over — caller should use startNextOver first
      if (legalCount(over.balls) >= 6) return prev;
      over.balls.push({ runs, isWide, isNoBall, isOut });
      return next;
    });
  }

  function startNextOver() {
    setState(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const inn = next.innings[next.currentInnings];
      const over = inn.overs[inn.overs.length - 1];
      if (!over || legalCount(over.balls) < 6) return prev;
      if (inn.overs.length < next.overs) {
        inn.overs.push(emptyOver());
      } else {
        if (next.currentInnings === 0) {
          next.currentInnings = 1;
          next.phase = 'innings2';
        } else {
          next.phase = 'done';
        }
      }
      return next;
    });
  }

  function undoLastBall() {
    setState(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      // If done and last innings just finished, revert
      if (next.phase === 'done') {
        next.phase = 'innings2';
        next.currentInnings = 1;
      }
      // If innings2 and innings1 just finished (current innings has no balls yet in first over)
      const inn = next.innings[next.currentInnings];
      if (next.phase === 'innings2' && inn.overs.length === 1 && inn.overs[0].balls.length === 0) {
        next.phase = 'innings1';
        next.currentInnings = 0;
        // fall through to remove from innings1
        const inn1 = next.innings[0];
        _removeLastBall(inn1, next.overs);
        return next;
      }
      _removeLastBall(inn, next.overs);
      return next;
    });
  }

  function _removeLastBall(inn, maxOvers) {
    // Remove last ball, potentially merging back an empty over
    if (!inn.overs.length) return;
    const lastOver = inn.overs[inn.overs.length - 1];
    if (lastOver.balls.length === 0 && inn.overs.length > 1) {
      // Remove the empty over and go back to previous
      inn.overs.pop();
    }
    const over = inn.overs[inn.overs.length - 1];
    if (over.balls.length > 0) {
      over.balls.pop();
    }
  }

  function newGame() {
    setState(defaultState());
  }

  const battingTeamName = state.phase !== 'setup'
    ? (state.currentInnings === 0 ? state.team1 : state.team2)
    : '';

  const bowlingTeamName = state.phase !== 'setup'
    ? (state.currentInnings === 0 ? state.team2 : state.team1)
    : '';

  const currentOvers = innings ? innings.overs : [];
  const completedOversCount = innings
    ? (currentOvers.length > 0 && legalCount(currentOvers[currentOvers.length - 1].balls) < 6
        ? currentOvers.length - 1
        : currentOvers.length)
    : 0;

  const isCurrentOverComplete = legalCount(currentOver.balls) >= 6;

  return {
    state,
    startGame,
    recordBall,
    startNextOver,
    undoLastBall,
    newGame,
    currentOver,
    currentOvers,
    completedOversCount,
    isCurrentOverComplete,
    battingTeamName,
    bowlingTeamName,
    legalCount,
    overRuns,
    overWides,
    overNoBalls,
    overWickets,
    isLegal,
  };
}
