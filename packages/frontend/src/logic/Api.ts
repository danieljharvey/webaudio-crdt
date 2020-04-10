import { EventType } from "./Events";

import axios from "axios";

export const fetchEvents = () =>
  axios
    .get("http://localhost:3006/events")
    .then(a => a.data)
    .catch(e => {
      console.error("Could not fetch!");
    });

export interface Postable {
  timestamp: number;
  event: EventType;
}

export const postEvents = (postable: Postable[]) =>
  axios
    .post("http://localhost:3006/pushEvents", { items: postable })
    .catch(console.error);
