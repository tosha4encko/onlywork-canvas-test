import {RectangleCollections} from 'geoms/rectangle-collection';
import {Rectangle} from 'geoms/Rectangle';
import {Point} from 'geoms/Point';
import {ActionsWithGeom} from './actions-with-geom';
import {Geometry} from '../geoms/geometry';
import {ReactiveCollectionFires} from '../reactive-colection';
import {find} from '../geom-utils/iterators';

interface ReadonlyRectangleCollection<T> {
  iterate(): Generator<T>;
  subscribe(cb: (own: ReadonlyRectangleCollection<T>) => void): void;
}

export class UserRectangleCollection {
  readonly hoveredGeomCollection: RectangleCollections;
  readonly sleepingGeomCollection: RectangleCollections;

  constructor(readonly allGeomCollection: RectangleCollections, userActions: ActionsWithGeom) {
    this.hoveredGeomCollection = new RectangleCollections();
    this.sleepingGeomCollection = new RectangleCollections();

    userActions.hoveredSubscribe(({geom, hovered}) => {
      const hoveredRectangle = this._getHoveredRectangle(geom);
      if (hoveredRectangle === undefined) {
        throw new Error(`bad hovered geom with id ${geom.id}`);
      }

      this._changeCollections(hoveredRectangle, hovered);
    });

    this.allGeomCollection.collection.subscribe(({type, objId}) => {
      const obj = this.allGeomCollection.collection.get(objId);
      if (type === ReactiveCollectionFires.Delete) {
        this.hoveredGeomCollection.collection.delete(obj);
        this.sleepingGeomCollection.collection.delete(obj);
      } else if (type === ReactiveCollectionFires.Append) {
        this.sleepingGeomCollection.collection.append(obj);
      }
    });
  }

  private _getHoveredRectangle(geom: Geometry): Rectangle | undefined {
    if (geom instanceof Rectangle) {
      return geom;
    }
    if (geom instanceof Point) {
      return find(this.allGeomCollection.collection.iterate(), (rectangle) => rectangle.points.has(geom));
    }
  }

  private _changeCollections(rectangle: Rectangle, hovered: boolean) {
    if (hovered) {
      this.hoveredGeomCollection.collection.append(rectangle);
      this.sleepingGeomCollection.collection.delete(rectangle);
    } else {
      this.hoveredGeomCollection.collection.delete(rectangle);
      this.sleepingGeomCollection.collection.append(rectangle);
    }
  }
}
