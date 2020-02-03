import React from "react";

import {
  fold,
  foldEvents,
  actions,
  dispatchEvent,
  fetchRemoteEvents
} from "../logic/Events";
import { initialState, initialDesiredState } from "../types/State";
import { diffAllOscs } from "../logic/Diff";
import { updateAudioTree } from "../logic/AudioTree";
import { Oscillator } from "./Oscillator";

export const Synth = () => {
  const [state, setState] = React.useState(initialState);
  const [num, setNum] = React.useState(1);

  const dispatch = dispatchEvent(
    () => state.events,
    events => setState(s => ({ ...s, events }))
  );

  React.useEffect(() => {
    const desiredState = fold(foldEvents, initialDesiredState, state.events);
    console.log("useEffect", desiredState);
    const webAudioState = updateAudioTree(
      state.webAudio,
      diffAllOscs(state.data.oscillators, desiredState.oscillators)
    );
    setState({
      ...state,
      webAudio: webAudioState,
      data: desiredState
    });
  }, [state.events]);

  // set event fetching interval
  React.useEffect(() => {
    fetchRemoteEvents(
      () => state.events,
      events => setState(s => ({ ...s, events }))
    );
  }, []);

  const create = () => {
    // create an osc and then increase number
    dispatch(actions.createOscillator({ id: `osc${num}`, _type: "OscNode" }));
    setNum(num + 1);
  };

  return (
    <div>
      {" "}
      <button onClick={create}>Create</button>
      {state.data.oscillators.map((osc, key) => (
        <Oscillator key={key} oscillator={osc} dispatch={dispatch} />
      ))}
    </div>
  );
};
