import {ui} from './ui';
import {RectangleCollections} from './geoms/RectangleCollection';
import {Subscriber} from './observable';
import {Point} from './geoms/Point';
import {UserActions} from './user-actions';
import {pointIterator} from './geoms/iterators';
import {Rectangle} from './geoms/Rectangle';
import {IReactiveGeometry} from './geoms/ReactiveGeometry';

const POINT_SIZE = 5;

function getColor(geom: IReactiveGeometry) {
  if (geom.selected) {
    return 'green';
  }
  if (geom.hovered) {
    return 'orange';
  }
  return 'blue';
}

// todo сделать функцией?
export class Render {
  private _subscribers: Subscriber[] = [];
  constructor(
    private _rectangleCollection: RectangleCollections,
    private _userReaction: UserActions,
    private _ui = ui,
  ) {
    this._subscribers.push(this._rectangleCollection.subscribe(this._render));
  }

  private _render = () => {
    const ctx = this._ui.canvas.getContext('2d');
    ctx.clearRect(0, 0, this._ui.canvas.width, this._ui.canvas.height);

    ctx.beginPath();
    this._rectangleCollection.collection.forEach(this._rectangleRender(ctx));
    ctx.stroke();

    ctx.beginPath();
    for (let point of pointIterator(this._rectangleCollection)) {
      this._pointRender(ctx)(point);
    }
    ctx.fill();
  };

  private _rectangleRender = (ctx: CanvasRenderingContext2D) => (rectangle: Rectangle) => {
    ctx.strokeStyle = getColor(rectangle);
    const [first, ...other] = rectangle.points;
    const [x0, y0] = first.coord;
    ctx.moveTo(x0, y0);
    other.forEach((point) => {
      const [x0, y0] = point.coord;
      ctx.lineTo(x0, y0);
    });
    ctx.closePath();
  };

  private _pointRender = (ctx: CanvasRenderingContext2D) => (point: Point) => {
    if (!point.selected && !point.hovered) {
      return;
    }

    ctx.fillStyle = getColor(point);
    ctx.arc(...point.coord, POINT_SIZE, 0, 2 * Math.PI, true);
  };

  destruct() {
    const ctx = this._ui.canvas.getContext('2d');
    ctx.clearRect(0, 0, this._ui.canvas.width, this._ui.canvas.height);
    this._rectangleCollection.collection = [];
    this._subscribers.forEach((subscriber) => subscriber.unsubscribe());
  }
}
