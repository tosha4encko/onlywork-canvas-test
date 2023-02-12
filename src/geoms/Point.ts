import {ReactiveGeometry} from './ReactiveGeometry';

interface IPoint {
  id: number;
  coord: [number, number];
}

export class Point extends ReactiveGeometry<IPoint> implements IPoint {
  constructor(private _coord: [number, number]) {
    super();
  }

  get coord(): [number, number] {
    return [...this._coord];
  }

  set coord(coord: [number, number]) {
    this._coord = [...coord];
    this._notify({id: this.id, coord: [...coord]});
  }
}
