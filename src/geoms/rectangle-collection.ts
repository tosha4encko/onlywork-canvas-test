import {ReactiveCollection} from 'reactive-colection';
import {Rectangle, Geometry, Coord} from '.';
import {IRecoverableSnapshot} from 'user-activity/snapshots-caretaker';
import {map, pointIterator} from '../geom-utils';

interface IRectangleCollectionsSnapshot extends IRecoverableSnapshot {
  id: number;
  collection: Rectangle[];
  recover(): void;
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

  snapshot(): IRectangleCollectionsSnapshot {
    const collectionSnapshot = [...this.collection.iterate()];
    const rectanglesSnapshots = [...map(this.collection.iterate(), (rectangle) => rectangle.snapshot())];
    const pointsSnapshots = [...map(pointIterator(this), (point) => point.snapshot())];

    return {
      id: this.id,
      collection: collectionSnapshot,
      recover: () => {
        this.collection.clear();
        this.collection.append(...collectionSnapshot);
        rectanglesSnapshots.forEach((snapshot) => snapshot.recover());
        pointsSnapshots.forEach((snapshot) => snapshot.recover());
      },
    };
  }
}
