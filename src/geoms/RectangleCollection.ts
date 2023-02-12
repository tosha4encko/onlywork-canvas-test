import {Rectangle} from './Rectangle';
import {ReactiveGeometry} from './ReactiveGeometry';

interface IRectangleCollections {
  id: number;
  collection: Rectangle[];
}

function isRectangleList(value: any[]): value is Rectangle[] {
  return value.every((v) => v instanceof Rectangle);
}

export class RectangleCollections extends ReactiveGeometry<IRectangleCollections> implements IRectangleCollections {
  private _collection: Rectangle[];

  constructor(collection?: [number, number][][]);
  constructor(collection?: Rectangle[]);
  constructor(collection: Rectangle[] | [number, number][][] = []) {
    super();
    if (isRectangleList(collection)) {
      this._collection = [...collection];
    } else {
      this._collection = collection.map((rectangle) => new Rectangle(rectangle));
    }
  }

  get collection(): Rectangle[] {
    return [...this._collection];
  }

  set collection(collection: Rectangle[]) {
    this._collection = [...collection];
    this._notify({id: this.id, collection: [...collection]});
  }

  push(rectangle: Rectangle) {
    this._collection.push(rectangle);
    this._notify({id: this.id, collection: [...this._collection]});
  }
}
