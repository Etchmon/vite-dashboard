import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/nav/Navbar';
import Dashboard from './components/main/Dashboard'

function App() {
  return (
    <Router>
      <Navbar />
      <Dashboard />
    </Router>
  );
}

export default App
