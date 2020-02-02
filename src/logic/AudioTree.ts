import {
  WebAudioState,
  OscillatorWithNode,
  StartedWebAudioState
} from "../types/State";
import { monoidOscNode } from "../types/Types";
import { OscNodeChange } from "./Diff";

// add only
export const updateAudioTree = (
  state: WebAudioState,
  actions: OscNodeChange[]
): WebAudioState => {
  console.log("updateAudioTree", actions);
  const newestState = actions.reduce(
    (newState, action) => doOscNodeChangeAction(newState, action),
    startWebAudioState(state)
  );
  console.log(newestState);
  return newestState;
};

const startWebAudioState = (state: WebAudioState): StartedWebAudioState => {
  console.log("startWebAudioState", state);
  if (state.context !== null) {
    return state;
  } else {
    console.log("creating webaudio context");
    return {
      ...state,
      context: new AudioContext(),
      oscillators: {}
    };
  }
};

const doOscNodeChangeAction = (
  state: StartedWebAudioState,
  action: OscNodeChange
): StartedWebAudioState => {
  console.log("doOscNodeChangeAction", action._type);
  switch (action._type) {
    case "AddOscNode":
      const osc: OscillatorWithNode = {
        nodeId: {
          _type: "OscNode",
          id: action.payload.id
        },
        state: monoidOscNode.mempty
      };

      const oscillatorNode = state.context.createOscillator();
      oscillatorNode.connect(state.context.destination);

      oscillatorNode.frequency.setValueAtTime(
        osc.state.frequency.hz,
        state.context.currentTime
      );
      if (osc.state.playing === "start") {
        oscillatorNode.start();
      }
      oscillatorNode.type = osc.state.oscNodeType;

      return {
        ...state,
        oscillators: {
          ...state.oscillators,
          [action.payload.id]: oscillatorNode
        }
      };
    case "RemoveOscNode":
      // todo
      return state;
    case "ChangeOscNodeFrequency":
      const matchingFreq = state.oscillators[action.payload.id];
      if (matchingFreq && state.context) {
        matchingFreq.frequency.setValueAtTime(
          action.payload.frequency.hz,
          state.context.currentTime
        );
      }
      return state;

    case "ChangeOscNodePlaying":
      const matchingPlay = state.oscillators[action.payload.id];
      if (matchingPlay && state.context) {
        if (action.payload.playing === "start") {
          matchingPlay.start();
        } else {
          matchingPlay.stop();
        }
      }
      return state;

    case "ChangeOscNodeType":
      const matchingType = state.oscillators[action.payload.id];
      if (matchingType && state.context) {
        matchingType.type = action.payload.oscNodeType;
      }
      return state;
  }
};

/*
  desiredState.oscillators.forEach(osc => {
    if (
      !state.oscillators.find(sOsc => sOsc.data.nodeId.id === osc.nodeId.id)
    ) {
      if (state.context) {
        console.log("Creating oscillator and setting initial values");
        const oscillatorNode = state.context.createOscillator();
        oscillatorNode.connect(state.context.destination);
        if (osc.state.playing === "start") {
          oscillatorNode.start();
        }
        oscillatorNode.frequency.setValueAtTime(
          osc.state.frequency.hz,
          state.context.currentTime
        );
        state.oscillators.push({ node: oscillatorNode, data: osc });
      }
    }
  });
  state.oscillators.filter(sOsc => {
    if (
      !desiredState.oscillators.find(
        osc => sOsc.data.nodeId.id === osc.nodeId.id
      )
    ) {
      if (state.context) {
        console.log("delete osc!");
        sOsc.node.stop();
        sOsc.node.disconnect(state.context.destination);
        sOsc.node = cheatingNull;
      }
      return false;
    } else {
      return true;
    }
  });
  */
