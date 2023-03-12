import {Observable} from './observable';

interface CollectinItem {
  id: number;
}
export class ReactiveCollection<T extends CollectinItem> {
  private _collection: Map<number, T> = new Map<number, T>();
  private _observable = new Observable<ReactiveCollection<T>>();

  subscribe(cb: (own: ReactiveCollection<T>) => void) {
    return this._observable.subscribe(cb);
  }

  get(id: number) {
    return this._collection.get(id);
  }

  has(id: number) {
    return !!this._collection.get(id);
  }

  append(item: T) {
    this._collection.set(item.id, item);
    this._observable.notify(this);
  }

  delete(id: number) {
    this._collection.delete(id);
    this._observable.notify(this);
  }

  *iterate() {
    const collection = this._collection;
    for (let item of collection.values()) {
      yield item;
    }
  }
}
