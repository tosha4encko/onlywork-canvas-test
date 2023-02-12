export interface Subscriber {
  unsubscribe: () => void;
}
export class Observable<T> {
  private _subscribers: Set<(value: T) => void> = new Set();

  notify(value: T) {
    this._subscribers.forEach((subscriber) => subscriber(value));
  }

  subscribe(cb: (value: T) => void): Subscriber {
    this._subscribers.add(cb);
    return {
      unsubscribe: () => this._subscribers.delete(cb),
    };
  }

  lock() {
    // todo
  }
}

const DEBOUNCE_TIME = 100;
export function debounce<T>(cb: (value: T) => void) {
  let lock = false;
  return (value: T) => {
    if (lock) {
      return;
    }

    lock = true;
    setTimeout(() => {
      cb(value);
      lock = false;
    }, DEBOUNCE_TIME);
  };
}
