import {ui} from './ui';
import {Point} from 'geoms/Point';
import {find, pointIterator} from 'geom-utils/iterators';
import {Rectangle} from 'geoms/Rectangle';
import {Geometry} from 'geoms/geometry';
import {Reactions} from './user-activity/reaction';
import {ReactiveCollection, ReactiveCollectionFires} from './reactive-colection';
import {UserRectangleCollection} from './user-activity/user-rectangle-collection';
import {RectangleCollections} from './geoms/rectangle-collection';
import {Subscriber} from './observable';

const POINT_SIZE = 5;

function getRelationsRectangle(geom: Geometry, collection: ReactiveCollection<Rectangle>) {
  if (geom instanceof Rectangle) {
    return geom;
  }
  if (geom instanceof Point) {
    return find(collection.iterate(), (rectangle) => rectangle.points.has(geom));
  }
}

function getColor(geom: Geometry, userActionsCollection: UserRectangleCollection) {
  const rect = getRelationsRectangle(geom, userActionsCollection.allGeomCollection.collection);
  if (userActionsCollection.hoveredGeomCollection.collection.has(rect)) {
    return 'orange';
  }
  return 'blue';
}

export class Render {
  constructor(
    private _userRectangleCollections: UserRectangleCollection,
    private _reactions: Reactions,
    private _ui = ui,
  ) {
    const {hoveredGeomCollection, sleepingGeomCollection} = this._userRectangleCollections;
    this._subscribeToRender(hoveredGeomCollection, this._ui.dirtyCanvas);
    this._subscribeToRender(sleepingGeomCollection, this._ui.canvas);
  }

  private _subscribeToRender(collection: RectangleCollections, canvas: HTMLCanvasElement) {
    const render = () => this._render(collection, canvas);
    collection.collection.subscribe(render);

    let pointsSubscribers: Subscriber[] = [];
    collection.collection.subscribe(({type}) => {
      if (type === ReactiveCollectionFires.Append) {
        for (const point of pointIterator(collection)) {
          pointsSubscribers.push(point.subscribe(render));
        }
      } else {
        for (const subscriber of pointsSubscribers) {
          subscriber.unsubscribe();
        }
        pointsSubscribers = [];
      }
    });
  }

  private _render = (rectanglesCollection: RectangleCollections, canvas: HTMLCanvasElement) => {
    console.log(`length - ${[...rectanglesCollection.collection.iterate()].length}; canvas - `, canvas);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let rectangle of rectanglesCollection.collection.iterate()) {
      console.log('-');
      this._rectangleRender(rectangle, canvas);
    }
    for (let point of pointIterator(rectanglesCollection)) {
      this._pointRender(point, canvas);
    }
  };

  private _rectangleRender = (rectangle: Rectangle, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');

    const [first, ...other] = rectangle.points.iterate();
    const [x0, y0] = first.coord;

    ctx.beginPath();
    ctx.strokeStyle = getColor(rectangle, this._userRectangleCollections);
    ctx.moveTo(x0, y0);
    other.forEach((point) => {
      const [x0, y0] = point.coord;
      ctx.lineTo(x0, y0);
    });

    ctx.closePath();
    ctx.stroke();
  };

  private _pointRender = (point: Point, canvas: HTMLCanvasElement) => {
    // if (!point.selected && !point.hovered) {
    //   return;
    // }

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = getColor(point, this._userRectangleCollections);
    ctx.arc(...point.coord, POINT_SIZE, 0, 2 * Math.PI, true);
    ctx.fill();
  };
}
