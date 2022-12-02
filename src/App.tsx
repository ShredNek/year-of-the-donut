import React from "react";
import "./App.css";
import Doughnut from "./Doughnut";

const App: React.FC = () => {
  return (
    <main>
      <div className="app-column"></div>
      <div className="app-background">
        <h1>TimeCount</h1>
        <Doughnut></Doughnut>
      </div>
      <div className="app-column"></div>
    </main>
  );
};

export default App;
