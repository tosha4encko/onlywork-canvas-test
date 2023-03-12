import {IGeometry, Geometry} from './geometry';
import {Observable} from '../observable';

export type Coord = [number, number];
interface IPoint extends IGeometry {
  id: number;
  coord: Coord;
}

export class Point extends Geometry<IPoint> implements IPoint {
  constructor(private _coord: Coord) {
    super();
  }

  protected _observable = new Observable<Point>();
  subscribe(cb: (value: Point) => void) {
    return this._observable.subscribe(cb);
  }

  snapshot(): IPoint {
    return {
      id: this.id,
      coord: [...this._coord],
    };
  }

  get coord(): Coord {
    return [...this._coord];
  }
  set coord(coord: Coord) {
    this._coord = [...coord];
    this._observable.notify(this);
  }
}