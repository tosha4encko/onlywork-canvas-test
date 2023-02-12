import {IReactiveGeometry, ReactiveGeometry} from './ReactiveGeometry';

interface IPoint extends IReactiveGeometry {
  id: number;
  coord: [number, number];
  selected: boolean;
  hovered: boolean;
}

export class Point extends ReactiveGeometry<IPoint> implements IPoint {
  constructor(private _coord: [number, number]) {
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

  get coord(): [number, number] {
    return [...this._coord];
  }

  set coord(coord: [number, number]) {
    this._coord = [...coord];
    this._observable.notify(this.snapshot());
  }
}
