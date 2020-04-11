import { SynthEventType } from "../synthEvents";
import {
  WebAudioDiffState,
  initialState as initialAudioDiffState
} from "@collabsynth/webaudio-diff";

// main state type
export interface State {
  audioDiff: WebAudioDiffState;
  events: Map<number, SynthEventType>;
  lastPushed: number | null;
}

export const initialState: State = {
  audioDiff: initialAudioDiffState,
  events: new Map(),
  lastPushed: null
};
