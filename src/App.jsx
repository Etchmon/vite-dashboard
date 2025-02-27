import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/nav/Navbar";
import Landing from "./components/main/Landing";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
