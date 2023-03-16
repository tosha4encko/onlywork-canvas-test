import {ui} from './ui';
import {RectangleCollections} from 'geoms/rectangle-collection';
import {Subscriber} from './observable';
import {Point} from 'geoms/Point';
import {ActionsWithGeom} from './user-activity/actions-with-geom';
import {find, pointIterator} from 'geom-utils/iterators';
import {Rectangle} from 'geoms/Rectangle';
import {Geometry} from 'geoms/geometry';
import {Reactions} from './user-activity/reaction';
import {ReactiveCollection} from './reactive-colection';
import {UserRectangleCollection} from './user-activity/user-rectangle-collection';

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
  const rect = getRelationsRectangle(geom, userActionsCollection.allGeomCollection);
  if (userActionsCollection.hoveredGeomCollection.has(rect)) {
    return 'orange';
  }
  return 'blue';
}

export class Render {
  private _subscribers: Subscriber[] = [];
  constructor(
    private _rectangleCollection: RectangleCollections,
    private _userRectangleCollections: UserRectangleCollection,
    private _userReaction: ActionsWithGeom,
    private _reactions: Reactions,
    private _ui = ui,
  ) {
    this._subscribers.push(
      this._rectangleCollection.collection.subscribe(() => {
        for (const point of pointIterator(this._rectangleCollection)) {
          this._subscribers.push(point.subscribe(this._render));
        }
      }),
    );
    this._subscribers.push(this._rectangleCollection.collection.subscribe(this._render));
    this._subscribers.push(this._reactions.hoveredGeomCollection.subscribe(this._render));
  }

  private _render = () => {
    console.log('render');
    this._clear();
    for (let rectangle of this._rectangleCollection.collection.iterate()) {
      this._rectangleRender(rectangle);
    }
    for (let point of pointIterator(this._rectangleCollection)) {
      this._pointRender(point);
    }
  };

  private _clear() {
    const ctx = this._ui.canvas.getContext('2d');
    ctx.clearRect(0, 0, this._ui.canvas.width, this._ui.canvas.height);

    const editctx = this._ui.editableCanvas.getContext('2d');
    editctx.clearRect(0, 0, this._ui.canvas.width, this._ui.canvas.height);
  }

  private _rectangleRender = (rectangle: Rectangle) => {
    const ctx = this._ui.canvas.getContext('2d');

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

  private _pointRender = (point: Point) => {
    // if (!point.selected && !point.hovered) {
    //   return;
    // }

    const ctx = this._ui.canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = getColor(point, this._userRectangleCollections);
    ctx.arc(...point.coord, POINT_SIZE, 0, 2 * Math.PI, true);
    ctx.fill();
  };

  destruct() {
    // todo тут где-то баг
    const ctx = this._ui.canvas.getContext('2d');
    ctx.clearRect(0, 0, this._ui.canvas.width, this._ui.canvas.height);
    this._rectangleCollection.collection.clear();
    this._subscribers.forEach((subscriber) => subscriber.unsubscribe());
  }
}
