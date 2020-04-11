import * as Types from "../types/webAudioTypes";
import { DesiredState } from "../state";

// here we diff the states

interface RemoveOscNode {
  _type: "RemoveOscNode";
  payload: {
    id: string;
  };
}

interface AddOscNode {
  _type: "AddOscNode";
  payload: {
    id: string;
  };
}

interface ChangeOscNodePlaying {
  _type: "ChangeOscNodePlaying";
  payload: {
    id: string;
    playing: Types.Playing;
  };
}

interface ChangeOscNodeFrequency {
  _type: "ChangeOscNodeFrequency";
  payload: {
    id: string;
    frequency: Types.Frequency;
  };
}

interface ChangeOscNodeType {
  _type: "ChangeOscNodeType";
  payload: {
    id: string;
    oscNodeType: Types.OscNodeType;
  };
}

export type OscNodeChange =
  | RemoveOscNode
  | AddOscNode
  | ChangeOscNodePlaying
  | ChangeOscNodeFrequency
  | ChangeOscNodeType;

const doOscDiff = (
  id: string,
  older: Types.OscNode,
  newer: Types.OscNode
): OscNodeChange[] => {
  let changes: OscNodeChange[] = [];
  if (older.playing !== newer.playing) {
    changes.push({
      _type: "ChangeOscNodePlaying",
      payload: { playing: newer.playing, id }
    });
  }
  if (older.frequency !== newer.frequency) {
    changes.push({
      _type: "ChangeOscNodeFrequency",
      payload: { frequency: newer.frequency, id }
    });
  }
  if (older.oscNodeType !== newer.oscNodeType) {
    changes.push({
      _type: "ChangeOscNodeType",
      payload: { oscNodeType: newer.oscNodeType, id }
    });
  }
  return changes;
};

export const diffAllOscs = (
  older: DesiredState["oscillators"],
  newer: DesiredState["oscillators"]
): OscNodeChange[] => {
  let changes: OscNodeChange[] = [];
  // go through new things
  newer.map(newOsc => {
    const matching = older.find(
      oldOsc => oldOsc.nodeId.id === newOsc.nodeId.id
    );
    if (matching) {
      // if we have a matching one, calc any diff
      changes = changes.concat(
        doOscDiff(newOsc.nodeId.id, matching.state, newOsc.state)
      );
    } else {
      // if it doesn't exist yet, create it and then add diff if neededs
      const oldOscNodeState = Types.monoidOscNode.mempty;
      changes.push({
        _type: "AddOscNode",
        payload: {
          id: newOsc.nodeId.id
        }
      });
      changes = changes.concat(
        doOscDiff(newOsc.nodeId.id, oldOscNodeState, newOsc.state)
      );
    }
  });
  older.map(oldOsc => {
    const matching = newer.find(
      newOsc => oldOsc.nodeId.id === newOsc.nodeId.id
    );
    if (!matching) {
      // need to delete one
      changes.push({
        _type: "RemoveOscNode",
        payload: {
          id: oldOsc.nodeId.id
        }
      });
    }
  });
  return changes;
};
