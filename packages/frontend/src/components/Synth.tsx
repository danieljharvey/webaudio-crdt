import React from "react";

import {
  updateToDesiredState,
  initialDesiredState
} from "@collabsynth/webaudio-diff";
import { initialState } from "../appState/state";
import {
  fold,
  foldSynthEvents,
  oscillatorActions,
  SynthEventType,
  getCurrentTimestamp
} from "../synthEvents";
import { fetchSynthEvents, postSynthEvents } from "../synthEvents/api";
import { Oscillator } from "./Oscillator";
import { reducer, getOutstanding, getMaxKey } from "../appState/reducer";

function useInterval(callback: any, delay: number) {
  const savedCallback: any = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      if (savedCallback && savedCallback.current !== undefined) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const Synth = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [num, setNum] = React.useState<number>(1);

  const dispatchEvt = (evt: SynthEventType) => {
    const timestamp = getCurrentTimestamp();
    dispatch({
      type: "AddSynthEvent",
      payload: {
        evt,
        timestamp
      }
    });
  };

  React.useEffect(() => {
    // fold over events to get the currently desired state
    const desiredState = fold(
      foldSynthEvents,
      initialDesiredState,
      state.events
    );
    // apply this state to the web audio graph
    const webAudioState = updateToDesiredState(state.audioDiff, desiredState);
    // save the new state
    dispatch({
      type: "UpdateAudioTree",
      payload: { diffState: webAudioState, desired: desiredState }
    });
  }, [state.events]);

  type Return = [number, SynthEventType][];
  useInterval(() => {
    fetchSynthEvents().then((newSynthEvents: Return) =>
      dispatch({ type: "SaveSynthEvents", payload: { events: newSynthEvents } })
    );
  }, 1000);

  useInterval(() => {
    const outstanding = getOutstanding(state);
    const key = getMaxKey(state);
    postSynthEvents(outstanding).then(_ => {
      dispatch({ type: "SetLastPushed", payload: { timestamp: key } });
    });
  }, 1000);

  const create = () => {
    // create an osc and then increase number
    dispatchEvt(
      oscillatorActions.createOscillator({ id: `osc${num}`, _type: "OscNode" })
    );
    setNum(num + 1);
  };

  return (
    <div>
      {" "}
      <button onClick={create}>Create</button>
      {state.audioDiff.desired.oscillators.map((osc, key) => (
        <Oscillator
          key={key}
          oscillator={osc}
          dispatchSynthEvent={dispatchEvt}
        />
      ))}
    </div>
  );
};
