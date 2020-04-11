import { updateAudioTree } from "./update";
import { diffAllOscs } from "./diff/diffOscillator";
import { WebAudioDiffState, DesiredState } from "./state";
export {
  WebAudioDiffState,
  DesiredState,
  initialState,
  initialDesiredState,
  OscillatorWithNode,
} from "./state";
export * from "./types/webAudioTypes";

// this takes the current webaudio state and the new desired state
// updates the web audio tree and returns a new WebAudioDiffState
export const updateToDesiredState = (
  state: WebAudioDiffState,
  desiredState: DesiredState
): WebAudioDiffState => ({
  webAudio: updateAudioTree(
    state.webAudio,
    diffAllOscs(state.desired.oscillators, desiredState.oscillators)
  ),
  desired: desiredState,
});
