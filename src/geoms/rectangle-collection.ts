import {ReactiveCollection} from 'reactive-colection';
import {Rectangle, Geometry, Coord} from '.';
import {IRecoverableSnapshot} from 'user-activity/snapshots-caretaker';

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
    const collection = [...this.collection.iterate()];
    const rectanglesSnapshots = collection.map(rectangle => rectangle.snapshot());

    return {
      id: this.id,
      collection: collection,
      recover: () => {
        this.collection.clear();
        this.collection.append(...collection);
        rectanglesSnapshots.forEach((snapshot) => snapshot.recover());
      },
    };
  }
}
