import {ui} from 'ui';
import {debounce} from 'observable';
import {Geometry, Coord, Point, RectangleCollections, Rectangle} from 'geoms';
import {getIntersectionGeom} from 'geom-utils';
import {SnapshotCaretaker} from './snapshots-caretaker';

export class MoveGeomHandler {
  private _clickPoint?: Coord;
  private _activeGeom?: Geometry;
  private _needSnapshot = false;

  constructor(
    private _geomCollection: RectangleCollections, 
    private _snapshotCaretaker: SnapshotCaretaker,
    private _reactionArea = ui.canvas
  ) {
    this._reactionArea.addEventListener('mousemove', debounce(this._moveListener));
    this._reactionArea.addEventListener('mousedown', this._mouseDownHandler);
    this._reactionArea.addEventListener('mouseup', this._mouseUpHandler);
  }

  private _mouseDownHandler = ({x, y}: MouseEvent) => {
    this._clickPoint = [x, y];
  };

  private _mouseUpHandler = () => {
    if (this._needSnapshot) {
      this._snapshotCaretaker.record()
      this._needSnapshot = false;
    }
    this._activeGeom = undefined;
    this._clickPoint = undefined;
  };

  private _moveListener = (ev: MouseEvent) => {
    if (this._clickPoint) {
      this._activeGeom = getIntersectionGeom(this._geomCollection, this._clickPoint);
      if (this._activeGeom === undefined) {
        return;
      }
      
      this._needSnapshot = true;
      const {x: x0, y: y0} = ev;
      const [x, y] = this._clickPoint;
      const [xM, yM] = [x - x0, y - y0];
      this._clickPoint = [x0, y0];
  
      if (this._activeGeom instanceof Point) {
        const [x0, y0] = this._activeGeom.coord;
        this._activeGeom.coord = [x0 - xM, y0 - yM];
      }
  
      if (this._activeGeom instanceof Rectangle) {
        for (const point of this._activeGeom.points.iterate()) {
          const [x0, y0] = point.coord;
          point.coord = [x0 - xM, y0 - yM];
        }
      }
    }
  };
}
