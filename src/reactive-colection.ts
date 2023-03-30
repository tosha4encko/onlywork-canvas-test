import {Observable} from 'observable';
import {IGeometry} from 'geoms/geometry';

export enum ReactiveCollectionFires {
  Append = 'append',
  Delete = 'delete',
  Clear = 'clear',
}

export type ReactiveCollectionChangeEvent = {type: ReactiveCollectionFires; objId: number};

export class ReactiveCollection<T extends IGeometry> {
  private _collection: Map<number, T> = new Map<number, T>();
  private _observable = new Observable<{type: ReactiveCollectionFires; objId?: number}>();

  subscribe(cb: (ev: ReactiveCollectionChangeEvent) => void) {
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

  append(...items: T[]) {
    for (const item of items) {
      this._collection.set(item.id, item);
      this._observable.notify({objId: item.id, type: ReactiveCollectionFires.Append});
    }
  }

  delete(id: number): void;
  delete(item: T): void;
  delete(idOrItem: number | T) {
    const id = typeof idOrItem === 'number' ? idOrItem : idOrItem.id;
    this._collection.delete(id);
    this._observable.notify({objId: id, type: ReactiveCollectionFires.Delete});
  }

  clear() {
    this._collection.clear();
    this._observable.notify({type: ReactiveCollectionFires.Delete});
  }

  *iterate() {
    const collection = this._collection;
    for (let item of collection.values()) {
      yield item;
    }
  }
}
