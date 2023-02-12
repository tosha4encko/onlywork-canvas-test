import {IReactiveGeometry, ReactiveGeometry} from './ReactiveGeometry';

export type Coord = [number, number];
interface IPoint extends IReactiveGeometry {
  id: number;
  coord: Coord;
  selected: boolean;
  hovered: boolean;
}

export class Point extends ReactiveGeometry<IPoint> implements IPoint {
  constructor(private _coord: Coord) {
    super();
  }

  snapshot(): IPoint {
    console.log('point-snapshot');
    return {
      id: this.id,
      coord: [...this._coord],
      selected: this._selected,
      hovered: this._hovered,
    };
  }

  get coord(): Coord {
    return [...this._coord];
  }

  set coord(coord: Coord) {
    this._coord = [...coord];
    this._observable.notify(this.snapshot());
  }
}
