import * as React from "react";
import { SynthEventType, oscillatorActions } from "../synthEvents";
import { OscillatorWithNode } from "@collabsynth/webaudio-diff";

interface OscillatorProps {
  oscillator: OscillatorWithNode;
  dispatchSynthEvent: (evt: SynthEventType) => void;
}

export const Oscillator: React.FunctionComponent<OscillatorProps> = ({
  oscillator,
  dispatchSynthEvent
}) => {
  const start = () =>
    dispatchSynthEvent(
      oscillatorActions.setPlaying(oscillator.nodeId, "start")
    );

  const increaseFreq = () =>
    dispatchSynthEvent(
      oscillatorActions.setFrequency(oscillator.nodeId, {
        ...oscillator.state.frequency,
        hz: oscillator.state.frequency.hz + 10
      })
    );

  const decreaseFreq = () =>
    dispatchSynthEvent(
      oscillatorActions.setFrequency(oscillator.nodeId, {
        ...oscillator.state.frequency,
        hz: oscillator.state.frequency.hz - 10
      })
    );

  const setSquareWave = () =>
    dispatchSynthEvent(
      oscillatorActions.setOscNodeType(oscillator.nodeId, "square")
    );

  const setSawtooth = () =>
    dispatchSynthEvent(
      oscillatorActions.setOscNodeType(oscillator.nodeId, "sawtooth")
    );

  return (
    <div>
      <p>{oscillator.nodeId.id}</p>
      {oscillator.state.playing === "stop" && (
        <button onClick={start}>GOOOOOOO</button>
      )}
      <button onClick={decreaseFreq}>DOWN</button>
      <button onClick={increaseFreq}>UP</button>
      {oscillator.state.oscNodeType !== "sawtooth" && (
        <button onClick={setSawtooth}>Sawtooth</button>
      )}
      {oscillator.state.oscNodeType !== "square" && (
        <button onClick={setSquareWave}>Square</button>
      )}
    </div>
  );
};
