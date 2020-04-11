import * as Types from "./types/webAudioTypes";

interface EmptyWebAudioState {
  context: null;
}

export interface StartedWebAudioState {
  context: AudioContext;
  oscillators: { [key: string]: OscillatorNode };
}

export type WebAudioState = EmptyWebAudioState | StartedWebAudioState;

// oscillator with node info
export interface OscillatorWithNode {
  nodeId: Types.NodeId;
  state: Types.OscNode;
}

export const initialWebAudioState: WebAudioState = {
  context: null
};

// tree for diffing
export interface DesiredState {
  oscillators: OscillatorWithNode[];
}

export const initialDesiredState: DesiredState = {
  oscillators: []
};

// main state type

export interface WebAudioDiffState {
  webAudio: WebAudioState;
  desired: DesiredState;
}

export const initialState: WebAudioDiffState = {
  webAudio: { context: null },
  desired: initialDesiredState
};
