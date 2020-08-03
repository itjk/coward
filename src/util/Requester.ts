export interface Requester {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
