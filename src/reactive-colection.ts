import {Observable} from './observable';
import {IGeometry} from './geoms/geometry';

export class ReactiveCollection<T extends IGeometry> {
  private _collection: Map<number, T> = new Map<number, T>();
  private _observable = new Observable<ReactiveCollection<T>>();

  subscribe(cb: (own: ReactiveCollection<T>) => void) {
    // todo добавить тип события
    return this._observable.subscribe(cb);
  }

  get(id: number) {
    return this._collection.get(id);
  }

  has(id: number): boolean;
  has(item: T): boolean;
  has(idOrItem: number | T) {
    return !!this._collection.get(typeof idOrItem === 'number' ? idOrItem : idOrItem.id);
  }

  append(item: T) {
    this._collection.set(item.id, item);
    this._observable.notify(this);
  }

  delete(id: number): void;
  delete(item: T): void;
  delete(idOrItem: number | T) {
    this._collection.delete(typeof idOrItem === 'number' ? idOrItem : idOrItem.id);
    this._observable.notify(this);
  }

  clear() {
    this._collection.clear();
    this._observable.notify(this);
  }

  *iterate() {
    const collection = this._collection;
    for (let item of collection.values()) {
      yield item;
    }
  }
}
