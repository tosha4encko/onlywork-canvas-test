import {Rectangle} from './Rectangle';
import {IReactiveGeometry, ReactiveGeometry} from './ReactiveGeometry';
import {Subscriber} from '../observable';
import {Coord} from './Point';

interface IRectangleCollections extends IReactiveGeometry {
  id: number;
  collection: Rectangle[];
  selected: boolean;
  hovered: boolean;
}

function isRectangleList(value: any[]): value is Rectangle[] {
  return value.every((v) => v instanceof Rectangle);
}

export class RectangleCollections extends ReactiveGeometry<IRectangleCollections> implements IRectangleCollections {
  private _collection: Rectangle[];
  private _subscribers: Subscriber[] = [];

  constructor(collection?: Coord[][]);
  constructor(collection?: Rectangle[]);
  constructor(collection: Rectangle[] | Coord[][] = []) {
    super();
    if (isRectangleList(collection)) {
      this._collection = [...collection];
    } else {
      this._collection = collection.map((rectangle) => new Rectangle(rectangle));
    }

    this._subscribers = this._collection.map((rectangle) => rectangle.subscribe(this.debouncedNotify));
  }

  snapshot(): IRectangleCollections {
    return {
      id: this.id,
      collection: [...this._collection],
      selected: this._selected,
      hovered: this._hovered,
    };
  }

  get collection(): Rectangle[] {
    return [...this._collection];
  }

  set collection(collection: Rectangle[]) {
    this._collection = [...collection];
    this._observable.notify(this.snapshot());

    this._subscribers.forEach((subscriber) => subscriber.unsubscribe());
    this._subscribers = collection.map((rectangle) => rectangle.subscribe(this.debouncedNotify));
  }

  push(rectangle: Rectangle) {
    this._collection.push(rectangle);
    this._observable.notify(this.snapshot());
    this._subscribers.push(rectangle.subscribe(this.debouncedNotify));
  }
}
