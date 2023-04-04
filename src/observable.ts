export interface Subscriber {
  unsubscribe: () => void;
}
export class Observable<T> {
  private _subscribers: Set<(value: T) => void> = new Set();

  notify(ev: T) {
    this._subscribers.forEach((subscriber) => subscriber(ev));
  }

  subscribe(cb: (ev: T) => void): Subscriber {
    this._subscribers.add(cb);
    return {
      unsubscribe: () => this._subscribers.delete(cb),
    };
  }

  lock() {
    // todo
  }
}

window.DEBOUNCE_TIME = 1;
export function debounce<T>(cb: (value: T) => void, t = window.DEBOUNCE_TIME) {
  let lock = false;
  return (value: T) => {
    if (lock) {
      return;
    }

    lock = true;
    setTimeout(() => {
      cb(value);
      lock = false;
    }, t);
  };
}
