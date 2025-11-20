import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientsManagement from './components/PatientsManagement';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<PatientsManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
