import { useState } from 'react';
import { useGameState } from './useGameState';
import SetupScreen from './components/SetupScreen';
import BowlingTracker from './components/BowlingTracker';
import OverviewScreen from './components/OverviewScreen';
import InningsTransition from './components/InningsTransition';
import GameDoneScreen from './components/GameDoneScreen';

export default function App() {
  const game = useGameState();
  const [screen, setScreen] = useState('main');
  const [shownTransition, setShownTransition] = useState(false);

  const { state } = game;

  if (state.phase === 'setup') {
    return <SetupScreen onStart={game.startGame} />;
  }

  if (state.phase === 'done' && screen !== 'overview') {
    return (
      <GameDoneScreen
        state={state}
        overRuns={game.overRuns}
        overWickets={game.overWickets}
        onNewGame={game.newGame}
        onShowOverview={() => setScreen('overview')}
      />
    );
  }

  if (screen === 'overview') {
    return (
      <OverviewScreen
        state={state}
        currentOvers={game.currentOvers}
        legalCount={game.legalCount}
        overRuns={game.overRuns}
        overWides={game.overWides}
        overNoBalls={game.overNoBalls}
        overWickets={game.overWickets}
        battingTeamName={game.battingTeamName}
        onBack={() => setScreen('main')}
      />
    );
  }

  if (state.phase === 'innings2' && !shownTransition) {
    return (
      <InningsTransition
        state={state}
        overRuns={game.overRuns}
        overWickets={game.overWickets}
        onContinue={() => setShownTransition(true)}
      />
    );
  }

  return (
    <BowlingTracker
      state={state}
      currentOver={game.currentOver}
      currentOvers={game.currentOvers}
      completedOversCount={game.completedOversCount}
      isCurrentOverComplete={game.isCurrentOverComplete}
      battingTeamName={game.battingTeamName}
      bowlingTeamName={game.bowlingTeamName}
      recordBall={game.recordBall}
      startNextOver={game.startNextOver}
      undoLastBall={game.undoLastBall}
      legalCount={game.legalCount}
      overRuns={game.overRuns}
      overWides={game.overWides}
      overNoBalls={game.overNoBalls}
      overWickets={game.overWickets}
      onShowOverview={() => setScreen('overview')}
      onNewGame={game.newGame}
    />
  );
}
