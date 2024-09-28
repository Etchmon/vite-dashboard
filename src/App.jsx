import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Route path="/" />
      <Route path="/settings" />
    </Router>
  );
}

export default App
