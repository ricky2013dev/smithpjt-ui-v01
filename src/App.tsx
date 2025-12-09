import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientsManagement from './components/b2b-agent/PatientsManagement';
import HomePage from './components/HomePage';
import SmartAITransactionHistory from './components/b2b-agent/SmartAITransactionHistory';
import DailyJobDashboard from './components/b2b-agent/DailyJobDashboard';
import InsuranceCallDashboard from './components/insurance/InsuranceCallDashboard';
import InsuranceCallDetail from './components/insurance/InsuranceCallDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* B2B Agent Routes */}
        <Route path="/b2b-agent/dashboard" element={<DailyJobDashboard />} />
        <Route path="/b2b-agent/patient-appointments" element={<PatientsManagement />} />
        <Route path="/b2b-agent/smart-ai-transaction-history" element={<SmartAITransactionHistory />} />

        {/* Legacy routes - redirect to b2b-agent */}
        <Route path="/dashboard" element={<DailyJobDashboard />} />
        <Route path="/patient-appointments" element={<PatientsManagement />} />
        <Route path="/smart-ai-transaction-history" element={<SmartAITransactionHistory />} />

        {/* Insurance Agent Routes */}
        <Route path="/insurance/dashboard" element={<InsuranceCallDashboard />} />
        <Route path="/insurance/call/:callId" element={<InsuranceCallDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
