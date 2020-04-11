import {
  NodeId,
  Playing,
  Frequency,
  OscNodeType
} from "@collabsynth/webaudio-diff";

interface SynthEventShape<k, a> {
  kind: k;
  payload: a;
}

interface CreateOscillator {
  nodeId: NodeId;
}

const createOscillator = (nodeId: NodeId): SynthEventType => ({
  kind: "CreateOscillator",
  payload: {
    nodeId
  }
});

interface SetPlaying {
  nodeId: NodeId;
  playing: Playing;
}

const setPlaying = (nodeId: NodeId, playing: Playing): SynthEventType => ({
  kind: "SetPlaying",
  payload: {
    nodeId,
    playing
  }
});

interface SetFrequency {
  nodeId: NodeId;
  frequency: Frequency;
}

const setFrequency = (
  nodeId: NodeId,
  frequency: Frequency
): SynthEventType => ({
  kind: "SetFrequency",
  payload: {
    nodeId,
    frequency
  }
});

interface SetOscNodeType {
  nodeId: NodeId;
  oscNodeType: OscNodeType;
}

const setOscNodeType = (
  nodeId: NodeId,
  oscNodeType: OscNodeType
): SynthEventType => ({
  kind: "SetOscNodeType",
  payload: {
    nodeId,
    oscNodeType
  }
});

export type SynthEventType =
  | SynthEventShape<"SetPlaying", SetPlaying>
  | SynthEventShape<"CreateOscillator", CreateOscillator>
  | SynthEventShape<"SetFrequency", SetFrequency>
  | SynthEventShape<"SetOscNodeType", SetOscNodeType>;

export const oscillatorActions = {
  createOscillator,
  setPlaying,
  setFrequency,
  setOscNodeType
};
