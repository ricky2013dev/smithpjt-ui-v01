import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientsManagement from './components/PatientsManagement';
import HomePage from './components/HomePage';
import SmartAITransactionHistory from './components/SmartAITransactionHistory';
import DailyJobDashboard from './components/DailyJobDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DailyJobDashboard />} />
        <Route path="/patient-appointments" element={<PatientsManagement />} />
        <Route path="/smart-ai-transaction-history" element={<SmartAITransactionHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
