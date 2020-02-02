import React from "react";
import "./App.css";

import { actions, dispatchEvent } from "./logic/Events";
import {
  WebAudioState,
  DesiredState,
  initialDesiredState
} from "./types/State";
import { diffAllOscs } from "./logic/Diff";
import { updateAudioTree } from "./logic/AudioTree";
import { Oscillator } from "./components/Oscillator";

// gets new state, triggers side effects, returns new state
const resolveState = (state: State, desiredState: DesiredState): State => {
  const webAudioState = updateAudioTree(
    state.webAudio,
    diffAllOscs(state.data.oscillators, desiredState.oscillators)
  );
  return {
    ...state,
    webAudio: webAudioState,
    data: desiredState
  };
};

const updateState = (state: State, setState: (s: State) => void) => (
  newState: DesiredState
): void => {
  const fullNewState = resolveState(state, newState);
  console.log("saving fullNewState", fullNewState);
  setState(fullNewState);
};

interface State {
  webAudio: WebAudioState;
  data: DesiredState;
}

const initialState: State = {
  webAudio: { context: null },
  data: initialDesiredState
};

const SynthTime = () => {
  const [state, setState] = React.useState(initialState);
  const [num, setNum] = React.useState(1);

  const dispatch = dispatchEvent(updateState(state, setState));

  const create = () => {
    // create an osc and then increase number
    dispatch(actions.createOscillator({ id: `osc${num}`, _type: "OscNode" }));
    setNum(num + 1);
  };

  return (
    <div>
      {" "}
      <button onClick={create}>Create</button>
      {state.data.oscillators.map(osc => (
        <Oscillator oscillator={osc} dispatch={dispatch} />
      ))}
    </div>
  );
};

const App = () => {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="App" onClick={() => setVisible(true)}>
      {visible ? (
        <SynthTime />
      ) : (
        <button onClick={() => setVisible(true)}>Go</button>
      )}
    </div>
  );
};

export default App;
