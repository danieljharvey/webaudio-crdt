import { SynthEventType } from "./types/oscillatorEvents";

import axios from "axios";

export const fetchSynthEvents = () =>
  axios
    .get("http://localhost:3006/events")
    .then(a => a.data)
    .catch(e => {
      console.error("Could not fetch!");
    });

export interface Postable {
  timestamp: number;
  event: SynthEventType;
}

export const postSynthEvents = (postable: Postable[]) =>
  axios
    .post("http://localhost:3006/pushEvents", { items: postable })
    .catch(console.error);
