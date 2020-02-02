import * as Types from "./Types";

interface EmptyWebAudioState {
  context: null;
}

export interface StartedWebAudioState {
  context: AudioContext;
  oscillators: { [key: string]: OscillatorNode };
}

export type WebAudioState = EmptyWebAudioState | StartedWebAudioState;

export interface OscillatorWithNode {
  nodeId: Types.NodeId;
  state: Types.OscNode;
}

export const initialActualState: WebAudioState = {
  context: null
};

export interface DesiredState {
  oscillators: OscillatorWithNode[];
}

export const initialDesiredState: DesiredState = {
  oscillators: []
};
