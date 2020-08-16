import type * as events from "../Events.ts";

export type EventsKey = keyof typeof events;
export type EventsValue<K extends EventsKey> = typeof events[K];

export type EventsPayload<K extends EventsKey> = EventsValue<K> extends
  Emitter<infer E> ? E : {};

export type Events = {
  [K in EventsKey]: EventsValue<K>;
};

export type EventsListeners = {
  [K in EventsKey]?: Listener<EventsPayload<K>>;
};

export interface Listener<T extends object> {
  (event: T): void;
}

export class Emitter<T extends object = {}> {
  private readonly listeners: Listener<T>[] = [];

  on = (listener: Listener<T>) => {
    this.listeners.push(listener);
  };
  emit = (event: T) => {
    this.listeners.forEach((listener) => listener(event));
  };
}
