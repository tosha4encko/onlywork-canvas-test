import {RectangleCollections} from 'geoms/rectangle-collection';
import {Rectangle} from 'geoms/Rectangle';
import {Point} from 'geoms/Point';
import {ActionsWithGeom} from './actions-with-geom';
import {Geometry} from '../geoms/geometry';
import {ReactiveCollection} from '../reactive-colection';
import {find} from '../geom-utils/iterators';

interface ReadonlyRectangleCollection<T> {
  iterate(): Generator<T>;
  subscribe(cb: (own: ReadonlyRectangleCollection<T>) => void): void;
}

export class UserRectangleCollection {
  readonly allGeomCollection: ReactiveCollection<Rectangle>;
  readonly hoveredGeomCollection: ReactiveCollection<Rectangle>;
  readonly sleepingGeomCollection: ReactiveCollection<Rectangle>;

  constructor(rectangleCollection: RectangleCollections, userActions: ActionsWithGeom) {
    this.allGeomCollection = rectangleCollection.collection;
    this.hoveredGeomCollection = new ReactiveCollection<Rectangle>();
    this.sleepingGeomCollection = new ReactiveCollection<Rectangle>();

    userActions.hoveredSubscribe(({geom, hovered}) => {
      const hoveredRectangle = this._getHoveredRectangle(geom);
      if (hoveredRectangle === undefined) {
        throw new Error(`bad hovered geom with id ${geom.id}`);
      }

      this._changeCollections(hoveredRectangle, hovered);
    });
    this.allGeomCollection.subscribe(() => {});
  }

  private _getHoveredRectangle(geom: Geometry): Rectangle | undefined {
    if (geom instanceof Rectangle) {
      return geom;
    }
    if (geom instanceof Point) {
      return find(this.allGeomCollection.iterate(), (rectangle) => rectangle.points.has(geom));
    }
  }

  private _changeCollections(rectangle: Rectangle, hovered: boolean) {
    if (hovered) {
      this.hoveredGeomCollection.append(rectangle);
      this.sleepingGeomCollection.delete(rectangle);
    } else {
      this.hoveredGeomCollection.delete(rectangle);
      this.sleepingGeomCollection.append(rectangle);
    }
  }
}
