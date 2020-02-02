import { diffAllOscs } from "./Diff";
import { DesiredState, OscillatorWithNode } from "../types/State";
import { monoidOscNode } from "../types/Types";

const testOsc: OscillatorWithNode = {
  nodeId: { _type: "OscNode", id: "test" },
  state: monoidOscNode.mempty
};

describe("Diffs oscillator nodes", () => {
  it("Returns nothing for empty", () => {
    expect(diffAllOscs([], [])).toEqual([]);
  });

  it("Returns no changes when passed the same thing", () => {
    const old: DesiredState["oscillators"] = [testOsc];
    const newer: DesiredState["oscillators"] = [testOsc];
    expect(diffAllOscs(old, newer)).toEqual([]);
  });

  it("Returns a playing change from diff", () => {
    const old: DesiredState["oscillators"] = [testOsc];
    const testOscWithPlaying: OscillatorWithNode = {
      ...testOsc,
      state: {
        ...testOsc.state,
        playing: "start"
      }
    };
    const newer: DesiredState["oscillators"] = [testOscWithPlaying];
    expect(diffAllOscs(old, newer)).toEqual([
      {
        _type: "ChangeOscNodePlaying",
        payload: {
          id: "test",
          playing: "start"
        }
      }
    ]);
  });

  it("Creates a new node with no changes", () => {
    const old: DesiredState["oscillators"] = [];

    const newer: DesiredState["oscillators"] = [testOsc];
    expect(diffAllOscs(old, newer)).toEqual([
      {
        _type: "AddOscNode",
        payload: {
          id: "test"
        }
      }
    ]);
  });

  it("Creates a new node with changes", () => {
    const old: DesiredState["oscillators"] = [];
    const testOscWithPlaying: OscillatorWithNode = {
      ...testOsc,
      state: {
        ...testOsc.state,
        playing: "start"
      }
    };
    const newer: DesiredState["oscillators"] = [testOscWithPlaying];
    expect(diffAllOscs(old, newer)).toEqual([
      {
        _type: "AddOscNode",
        payload: {
          id: "test"
        }
      },
      {
        _type: "ChangeOscNodePlaying",
        payload: {
          playing: "start",
          id: "test"
        }
      }
    ]);
  });

  it("Deletes an unneeded node", () => {
    const old: DesiredState["oscillators"] = [testOsc];

    const newer: DesiredState["oscillators"] = [];
    expect(diffAllOscs(old, newer)).toEqual([
      {
        _type: "RemoveOscNode",
        payload: {
          id: "test"
        }
      }
    ]);
  });
});
