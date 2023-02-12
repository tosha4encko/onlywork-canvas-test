import {ReactiveGeometry} from './ReactiveGeometry';
import {Point} from './Point';

function isPointsList(value: any[]): value is Point[] {
  return value.every((v) => v instanceof Point);
}
interface IRectangle {
  id: number;
  points: Point[];
}

export class Rectangle extends ReactiveGeometry<IRectangle> implements IRectangle {
  private _points: Point[];

  constructor(points: [number, number][]);
  constructor(points: Point[]);
  constructor(points: Point[] | [number, number][]) {
    super();
    if (isPointsList(points)) {
      this._points = [...points];
    } else {
      this._points = points.map((point) => new Point(point));
    }
  }

  get points(): Point[] {
    return [...this._points];
  }

  set points(points: Point[]) {
    this._points = [...points];
    this._notify({id: this.id, points: [...points]});
    // todo notyfy на каждую точку
  }
}
