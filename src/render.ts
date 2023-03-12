import {ui} from './ui';
import {RectangleCollections} from 'geoms/rectangle-collection';
import {Observable, Subscriber} from './observable';
import {Point} from 'geoms/Point';
import {UserActions} from './user-actions';
import {filter, map, pointIterator, rectangleIterator} from 'geom-utils/iterators';
import {Rectangle} from 'geoms/Rectangle';
import {IGeometry} from 'geoms/geometry';
import {forEach, isEqual, keys} from 'lodash';

const POINT_SIZE = 5;

function getColor(geom: IGeometry) {
  // if (geom.selected) {
  //   return 'green';
  // }
  // if (geom.hovered) {
  //   return 'orange';
  // }
  return 'blue';
}

// class InactiveRectangles {
//   private _inactiveRectangles: Set<number> = new Set();
//   private _subscribers: Set<(rectangles: Set<number>) => void> = new Set();
//
//   constructor(collection: RectangleCollections) {
//     const hoveredRectangles = filter(rectangleIterator(collection), ({hovered}) => hovered);
//     this._inactiveRectangles = new Set(map(hoveredRectangles, ({id}) => id));
//
//     collection.subscribe((newCollrction) => {
//       if (!isEqual(this._inactiveRectangles, new Set(keys(newCollrction)))) {
//         const hoveredRectangles = filter(rectangleIterator(collection), ({hovered}) => hovered);
//         this._inactiveRectangles = new Set(map(hoveredRectangles, ({id}) => id));
//         this._subscribers.forEach((subscriber) => subscriber(this._inactiveRectangles));
//       }
//     });
//   }
//
//   subscribe(cb: (rectangles: Set<number>) => void) {
//     this._subscribers.add(cb);
//     return {unsubscribe: () => this._subscribers.delete(cb)};
//   }
//
//   getInactiveGeoms() {
//     return Array.from(this._inactiveRectangles);
//   }
// }

// function getInactiveRectangles(collection: IGeometry) {
//   return filter(rectangleIterator(collection), ({hovered}) => hovered);
// }

// todo сделать функцией?
export class Render {
  private _subscribers: Subscriber[] = [];
  constructor(
    private _rectangleCollection: RectangleCollections,
    private _userReaction: UserActions,
    private _ui = ui,
  ) {
    this._subscribers.push(this._rectangleCollection.collection.subscribe(this._render));
  }

  private _render = () => {
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
    ctx.strokeStyle = getColor(rectangle);
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
    ctx.fillStyle = getColor(point);
    ctx.arc(...point.coord, POINT_SIZE, 0, 2 * Math.PI, true);
    ctx.fill();
  };

  destruct() {
    // todo тут где-то баг
    // const ctx = this._ui.canvas.getContext('2d');
    // ctx.clearRect(0, 0, this._ui.canvas.width, this._ui.canvas.height);
    // this._rectangleCollection.collection = [];
    // this._subscribers.forEach((subscriber) => subscriber.unsubscribe());
  }
}
