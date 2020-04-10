import React from 'react';

import {
  fold,
  foldEvents,
  actions,
  EventType,
  fetchEvents,
  getCurrentTimestamp,
  postEvents,
} from '../logic/Events';
import {initialState, initialDesiredState, State} from '../types/State';
import {diffAllOscs} from '../logic/Diff';
import {updateAudioTree} from '../logic/AudioTree';
import {Oscillator} from './Oscillator';
import {reducer, getOutstanding, getMaxKey} from '../reducer/reducer';

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

  const dispatchEvt = (evt: EventType) => {
    const timestamp = getCurrentTimestamp();
    dispatch({
      type: 'AddEvent',
      payload: {
        evt,
        timestamp,
      },
    });
  };

  React.useEffect(() => {
    const desiredState = fold(foldEvents, initialDesiredState, state.events);
    const webAudioState = updateAudioTree(
      state.webAudio,
      diffAllOscs(state.data.oscillators, desiredState.oscillators),
    );
    dispatch({
      type: 'UpdateAudioTree',
      payload: {webAudio: webAudioState, desiredState},
    });
  }, [state.events]);

  type Return = [number, EventType][];
  useInterval(() => {
    fetchEvents().then((newEvents: Return) =>
      dispatch({type: 'SaveEvents', payload: {events: newEvents}}),
    );
  }, 1000);

  useInterval(() => {
    const outstanding = getOutstanding(state);
    const key = getMaxKey(state);
    postEvents(outstanding).then(_ => {
      dispatch({type: 'SetLastPushed', payload: {timestamp: key}});
    });
  }, 1000);

  const create = () => {
    // create an osc and then increase number
    dispatchEvt(actions.createOscillator({id: `osc${num}`, _type: 'OscNode'}));
    setNum(num + 1);
  };

  return (
    <div>
      {' '}
      <button onClick={create}>Create</button>
      {state.data.oscillators.map((osc, key) => (
        <Oscillator key={key} oscillator={osc} dispatchEvent={dispatchEvt} />
      ))}
    </div>
  );
};
