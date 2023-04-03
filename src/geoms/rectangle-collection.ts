import {ReactiveCollection} from 'reactive-colection';
import {Rectangle, IGeometry, Geometry, Coord} from '.';

interface IRectangleCollections extends IGeometry {
  id: number;
  collection: Rectangle[];
}

export class RectangleCollections extends Geometry {
  readonly collection = new ReactiveCollection<Rectangle>();

  constructor(collection?: Coord[][]);
  constructor(collection?: Rectangle[]);
  constructor(collection: Rectangle[] | Coord[][] = []) {
    super();
    for (const item of collection) {
      if (item instanceof Rectangle) {
        this.collection.append(item);
      } else {
        this.collection.append(new Rectangle(item));
      }
    }
  }

  snapshot(): IRectangleCollections {
    return {
      id: this.id,
      collection: [...this.collection.iterate()],
    };
  }
}
