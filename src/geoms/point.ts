import {Observable} from 'observable';
import {Geometry} from './geometry';

export type Coord = [number, number];
interface IPointSnapshot {
  id: number;
  coord: Coord;
  recover(): void;
}

export class Point extends Geometry {
  constructor(private _coord: Coord) {
    super();
  }

  protected _observable = new Observable<Point>();
  subscribe(cb: (value: Point) => void) {
    return this._observable.subscribe(cb);
  }

  snapshot(): IPointSnapshot {
    const coordSnapshot: Coord = [...this._coord];
    return {
      id: this.id,
      coord: coordSnapshot,
      recover: () => {
        this.coord = coordSnapshot;
      },
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
