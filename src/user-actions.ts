import {ui} from './ui';
import {RectangleCollections} from './geoms/RectangleCollection';
import {find, pointIterator} from './geoms/iterators';
import {Observable} from './observable';
import {IReactiveGeometry} from './geoms/ReactiveGeometry';

const EPS = 10;
//todo каррирование?
function equelPoints([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  return Math.abs(x1 - x2) < EPS && Math.abs(y1 - y2) < EPS;
}

export type SelectAction = {
  geom: IReactiveGeometry;
  selected: boolean;
};
export type HoveredAction = {
  geom: IReactiveGeometry;
  hovered: boolean;
};
export type MoveAction = {
  geom: IReactiveGeometry;
  moveCoord: [number, number];
};

// todo вычисления в webworker?
export class UserActions {
  private _hoveredObservable = new Observable<HoveredAction>();
  private _hoveredGeom?: IReactiveGeometry;

  private _movedObservable = new Observable<MoveAction>();
  private _clickPoint?: [number, number];

  constructor(private _geomCollection: RectangleCollections, private _reactionArea = ui.canvas) {
    this._reactionArea.addEventListener('mousemove', this._hoveredListener);
    this._reactionArea.addEventListener('mousemove', this._pointMoveListener);

    this._reactionArea.addEventListener('mousedown', ({x, y}) => (this._clickPoint = [x, y]));
    this._reactionArea.addEventListener('mouseup', () => (this._clickPoint = undefined));
  }

  hoveredSubscribe(cb: (value: HoveredAction) => void) {
    this._hoveredObservable.subscribe(cb);
  }

  private _hoveredListener = ({x, y}: MouseEvent) => {
    if (this._clickPoint !== undefined) {
      return;
    }

    const hoveredPoint = find(pointIterator(this._geomCollection), ({coord}) => equelPoints(coord, [x, y]));
    if (hoveredPoint === this._hoveredGeom) {
      return;
    }

    if (this._hoveredGeom) {
      this._hoveredObservable.notify({geom: this._hoveredGeom, hovered: false});
      this._hoveredGeom = undefined;
    }

    if (hoveredPoint) {
      this._hoveredObservable.notify({geom: hoveredPoint, hovered: true});
      this._hoveredGeom = hoveredPoint;
    }
  };

  pointMoveSubscribe(cb: (value: MoveAction) => void) {
    this._movedObservable.subscribe(cb);
  }

  private _pointMoveListener = (ev: MouseEvent) => {
    if (this._clickPoint === undefined || this._hoveredGeom === undefined) {
      return;
    }

    const {x: x0, y: y0} = ev;
    const [x, y] = this._clickPoint;
    this._clickPoint = [x0, y0];

    this._movedObservable.notify({
      geom: this._hoveredGeom,
      moveCoord: [x - x0, y - y0],
    });
  };
}
