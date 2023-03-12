import {ui} from './ui';
import {RectangleCollections} from './geoms/rectangle-collection';
import {debounce, Observable} from './observable';
import {IGeometry} from './geoms/geometry';
import {Coord} from './geoms/Point';
import {getIntersectionGeom} from 'geom-utils/intersection';

export type SelectAction = {
  geom: IGeometry;
  selected: boolean;
};
export type HoveredAction = {
  geom: IGeometry;
  hovered: boolean;
};
export type MoveAction = {
  geom: IGeometry;
  moveCoord: Coord;
};

export class UserActions {
  private _clickPoint?: Coord;
  private _activeGeom?: IGeometry;

  private _movedObservable = new Observable<MoveAction>();
  moveSubscribe(cb: (value: MoveAction) => void) {
    this._movedObservable.subscribe(cb);
  }

  private _hoveredObservable = new Observable<HoveredAction>();
  hoveredSubscribe(cb: (value: HoveredAction) => void) {
    this._hoveredObservable.subscribe(cb);
  }

  constructor(private _geomCollection: RectangleCollections, private _reactionArea = ui.canvas) {
    this._reactionArea.addEventListener('mousemove', debounce(this._hoveredListener));
    this._reactionArea.addEventListener('mousemove', debounce(this._moveListener));

    this._reactionArea.addEventListener('mousedown', ({x, y}) => (this._clickPoint = [x, y]));
    this._reactionArea.addEventListener('mouseup', () => (this._clickPoint = undefined));
  }

  private _hoveredListener = ({x, y}: MouseEvent) => {
    if (this._clickPoint !== undefined) {
      return;
    }
    const activeGeom = getIntersectionGeom(this._geomCollection, [x, y]);
    if (activeGeom === this._activeGeom) {
      return;
    }
    if (this._activeGeom) {
      this._hoveredObservable.notify({geom: this._activeGeom, hovered: false});
      this._activeGeom = undefined;
    }
    if (activeGeom) {
      this._hoveredObservable.notify({geom: activeGeom, hovered: true});
      this._activeGeom = activeGeom;
    }
  };

  private _moveListener = (ev: MouseEvent) => {
    if (this._clickPoint === undefined || this._activeGeom === undefined) {
      return;
    }

    const {x: x0, y: y0} = ev;
    const [x, y] = this._clickPoint;
    this._clickPoint = [x0, y0];

    this._movedObservable.notify({
      geom: this._activeGeom,
      moveCoord: [x - x0, y - y0],
    });
  };
}
