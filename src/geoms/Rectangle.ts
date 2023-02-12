import {IReactiveGeometry, ReactiveGeometry} from './ReactiveGeometry';
import {Point} from './Point';
import {Subscriber} from '../observable';

function isPointsList(value: any[]): value is Point[] {
  return value.every((v) => v instanceof Point);
}
interface IRectangle extends IReactiveGeometry {
  id: number;
  points: Point[];
  selected: boolean;
  hovered: boolean;
}

export class Rectangle extends ReactiveGeometry<IRectangle> implements IRectangle {
  private _points: Point[];
  private _subscribers: Subscriber[] = [];

  constructor(points: [number, number][]);
  constructor(points: Point[]);
  constructor(points: Point[] | [number, number][]) {
    super();
    if (isPointsList(points)) {
      this._points = [...points];
    } else {
      this._points = points.map((point) => new Point(point));
    }

    this._subscribers = this._points.map((point) => point.subscribe(this.debouncedNotify));
  }

  snapshot(): IRectangle {
    console.log('rectangle-snapshot');
    return {
      id: this.id,
      points: [...this._points],
      selected: this._selected,
      hovered: this._hovered,
    };
  }

  get points(): Point[] {
    return [...this._points];
  }

  set points(points: Point[]) {
    this._points = [...points];
    this._observable.notify(this.snapshot());

    this._subscribers.forEach((subscriber) => subscriber.unsubscribe());
    this._subscribers = points.map((point) => point.subscribe(this.debouncedNotify));
  }
}
