import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import PortfolioDashboard from "./components/PortfolioDashboard";
// import PortfolioDashboard from './src/components/PortfolioDashboard'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="App">
        <PortfolioDashboard />
      </div>
    </>
  );
}

export default App;
