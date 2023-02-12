import {ui} from './ui';
import {RectangleCollections} from './geoms/RectangleCollection';
import {edgeIterator, find, pointIterator, ever} from './geoms/iterators';
import {Observable} from './observable';
import {IReactiveGeometry} from './geoms/ReactiveGeometry';
import {equelPoints, getCenter, sign} from './geoms/utils';
import {Coord, Point} from './geoms/Point';
import {Rectangle} from './geoms/Rectangle';

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
  moveCoord: Coord;
};

// todo вычисления в webworker?
export class UserActions {
  private _hoveredObservable = new Observable<HoveredAction>();
  private _hoveredPoint?: Point;
  private _hoveredRectangle?: Rectangle;

  private _movedObservable = new Observable<MoveAction>();
  private _clickPoint?: Coord;

  constructor(private _geomCollection: RectangleCollections, private _reactionArea = ui.canvas) {
    this._reactionArea.addEventListener('mousemove', this._hoveredListener);
    this._reactionArea.addEventListener('mousemove', this._pointMoveListener);
    this._reactionArea.addEventListener('mousemove', this._hoverRectangleListener);

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
    if (hoveredPoint === this._hoveredPoint) {
      return;
    }
    if (this._hoveredPoint) {
      this._hoveredObservable.notify({geom: this._hoveredPoint, hovered: false});
      this._hoveredPoint = undefined;
    }
    if (hoveredPoint) {
      this._hoveredObservable.notify({geom: hoveredPoint, hovered: true});
      this._hoveredPoint = hoveredPoint;
    }
  };

  private _hoverRectangleListener = ({x, y}: MouseEvent) => {
    // todo разбить и упростить
    for (let rectangle of this._geomCollection.collection) {
      const center = getCenter(rectangle);
      const isInside = ever(edgeIterator(rectangle), (edge) => {
        const s = sign;
        return sign([x, y], edge) === sign(center, edge);
      });

      if (isInside) {
        if (this._hoveredRectangle) {
          this._hoveredObservable.notify({geom: this._hoveredRectangle, hovered: false});
          this._hoveredRectangle = undefined;
        }
        this._hoveredObservable.notify({geom: rectangle, hovered: true});
        this._hoveredRectangle = rectangle;
        return;
      }
    }

    if (this._hoveredRectangle) {
      this._hoveredObservable.notify({geom: this._hoveredRectangle, hovered: false});
      this._hoveredRectangle = undefined;
    }
  };

  pointMoveSubscribe(cb: (value: MoveAction) => void) {
    this._movedObservable.subscribe(cb);
  }

  private _pointMoveListener = (ev: MouseEvent) => {
    if (this._clickPoint === undefined || this._hoveredPoint === undefined) {
      return;
    }

    const {x: x0, y: y0} = ev;
    const [x, y] = this._clickPoint;
    this._clickPoint = [x0, y0];

    this._movedObservable.notify({
      geom: this._hoveredPoint,
      moveCoord: [x - x0, y - y0],
    });
  };
}
