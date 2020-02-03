import React from "react";
import "./App.css";

import { Synth } from "./components/Synth";

const App = () => {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="App" onClick={() => setVisible(true)}>
      {visible ? (
        <Synth />
      ) : (
        <button onClick={() => setVisible(true)}>Go</button>
      )}
    </div>
  );
};

export default App;
