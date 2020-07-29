export interface Listener<T> { (event: T): any }

export class Emitter<T> {
    private listeners: Listener<T>[] = []
    
    on = (listener: Listener<T>) => { this.listeners.push(listener) }
    emit = (event: T) => { this.listeners.forEach((listener) => listener(event)) }
}