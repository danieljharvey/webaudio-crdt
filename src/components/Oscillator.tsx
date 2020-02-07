import * as React from 'react';
import {EventType, actions} from '../logic/Events';
import {OscillatorWithNode} from '../types/State';

interface OscillatorProps {
  oscillator: OscillatorWithNode;
  dispatchEvent: (evt: EventType) => void;
}

export const Oscillator: React.FunctionComponent<OscillatorProps> = ({
  oscillator,
  dispatchEvent,
}) => {
  const start = () =>
    dispatchEvent(actions.setPlaying(oscillator.nodeId, 'start'));

  const increaseFreq = () =>
    dispatchEvent(
      actions.setFrequency(oscillator.nodeId, {
        ...oscillator.state.frequency,
        hz: oscillator.state.frequency.hz + 10,
      }),
    );

  const decreaseFreq = () =>
    dispatchEvent(
      actions.setFrequency(oscillator.nodeId, {
        ...oscillator.state.frequency,
        hz: oscillator.state.frequency.hz - 10,
      }),
    );

  const setSquareWave = () =>
    dispatchEvent(actions.setOscNodeType(oscillator.nodeId, 'square'));

  const setSawtooth = () =>
    dispatchEvent(actions.setOscNodeType(oscillator.nodeId, 'sawtooth'));

  return (
    <div>
      <p>{oscillator.nodeId.id}</p>
      {oscillator.state.playing === 'stop' && (
        <button onClick={start}>GOOOOOOO</button>
      )}
      <button onClick={decreaseFreq}>DOWN</button>
      <button onClick={increaseFreq}>UP</button>
      {oscillator.state.oscNodeType !== 'sawtooth' && (
        <button onClick={setSawtooth}>Sawtooth</button>
      )}
      {oscillator.state.oscNodeType !== 'square' && (
        <button onClick={setSquareWave}>Square</button>
      )}
    </div>
  );
};
