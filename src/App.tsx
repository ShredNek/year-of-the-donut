import React from "react";
import "./styles/App.css";
import Doughnut from "./Doughnut";

const App: React.FC = () => {
  return (
    <main>
      <div className="app-container">
        <h1 className="app-heading">Year of the Donut</h1>
        <Doughnut></Doughnut>
      </div>
    </main>
  );
};

export default App;
