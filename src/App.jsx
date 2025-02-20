import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/nav/Navbar";
import Landing from "./components/main/Landing";

function App() {
  return (
    <Router>
      <Navbar />
      <Landing />
    </Router>
  );
}

export default App;
