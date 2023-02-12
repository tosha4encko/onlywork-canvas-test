// todo объединить с UserActions?
import {RectangleCollections} from './geoms/RectangleCollection';
import {Rectangle} from './geoms/Rectangle';
import {Point} from './geoms/Point';
import {HoveredAction, MoveAction, SelectAction, UserActions} from './user-actions';

export class Reactions {
  constructor(private _geomCollection: RectangleCollections, private _userActions = new UserActions(_geomCollection)) {
    this._userActions.hoveredSubscribe(this._hoverGeometry);
    this._userActions.pointMoveSubscribe(this._pointMove);
  }

  private _hoverGeometry = ({geom, hovered}: HoveredAction) => {
    geom.hovered = hovered;
  };

  private _selectGeom = ({geom, selected}: SelectAction) => {
    geom.selected = selected;
  };

  private _pointMove = ({geom, moveCoord}: MoveAction) => {
    const [xM, yM] = moveCoord;
    if (geom instanceof Point) {
      const [x0, y0] = geom.coord;
      // todo плавность
      geom.coord = [x0 - xM, y0 - yM];
    }
  };

  private _rectangleMove = (rectangle: Rectangle, moveCoord: [number, number]) => {
    const [xM, yM] = moveCoord;
    rectangle.points.forEach((point) => {
      const [x0, y0] = point.coord;
      point.coord = [x0 - xM, y0 - yM];
    });
  };

  private _pointCheck = (point: Point) => {
    //todo сделать коллекции объектом
  };

  private _rectanglesCheck = (point: Rectangle) => {
    //todo
  };
}
