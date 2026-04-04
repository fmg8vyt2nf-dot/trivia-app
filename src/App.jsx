import { HashRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import GameSetupPage from './pages/GameSetupPage';
import GamePlayPage from './pages/GamePlayPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SettingsPage from './pages/SettingsPage';
import MasteryPage from './pages/MasteryPage';
import DailyChallengePage from './pages/DailyChallengePage';
import RecapPage from './pages/RecapPage';

export default function App() {
  return (
    <ThemeProvider>
    <GameProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/setup" element={<GameSetupPage />} />
            <Route path="/play" element={<GamePlayPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/mastery" element={<MasteryPage />} />
            <Route path="/daily" element={<DailyChallengePage />} />
            <Route path="/recap" element={<RecapPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </GameProvider>
    </ThemeProvider>
  );
}
