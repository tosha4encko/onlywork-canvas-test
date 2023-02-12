let lastIndex = 0;
export abstract class ReactiveGeometry<T> {
  readonly id = lastIndex++;

  private _subscribers: Set<(value: T) => void> = new Set();

  protected _notify(value: T) {
    this._subscribers.forEach((subscriber) => subscriber(value));
  }

  subscribe(cb: () => void) {
    this._subscribers.add(cb);
    return () => this._subscribers.delete(cb);
  }

  lock() {
    // todo
  }
}
