import { SynthEventType } from "../synthEvents";
import { DesiredState } from "@collabsynth/webaudio-diff";
import { FoldCache, makeFoldCache } from "@collabsynth/fold-cache";

import {
  WebAudioDiffState,
  initialState as initialAudioDiffState
} from "@collabsynth/webaudio-diff";

// main state type
export interface State {
  audioDiff: WebAudioDiffState;
  eventCache: FoldCache<DesiredState, SynthEventType>;
  lastPushed: number | null;
}

export const initialState: State = {
  audioDiff: initialAudioDiffState,
  eventCache: makeFoldCache(),
  lastPushed: null
};
