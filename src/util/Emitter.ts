import type * as events from "../Events.ts";

export type EventsKey = keyof typeof events;

export type EventsEmitterEvent<K extends EventsKey = EventsKey> =
  typeof events[K] extends Emitter<infer E> ? E : {};

export type Events = {
  [K in EventsKey]: Emitter<EventsEmitterEvent<K>>;
};

export type EventsListener<K extends EventsKey = EventsKey> = Listener<
  EventsEmitterEvent<K>
>;

export type EventsListeners = {
  [K in EventsKey]?: EventsListener<K>;
};

export interface Listener<T> {
  (event: T): any;
}

export class Emitter<T> {
  private readonly listeners: Listener<T>[] = [];

  on = (listener: Listener<T>) => {
    this.listeners.push(listener);
  };
  emit = (event: T) => {
    this.listeners.forEach((listener) => listener(event));
  };
}
