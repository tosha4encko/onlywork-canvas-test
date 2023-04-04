import {ui} from 'ui';
import {debounce} from 'observable';
import {Point, Rectangle, RectangleCollections} from 'geoms';
import {getIntersectionGeom, find} from 'geom-utils';

export class HoverGeomHandler {
  private _mouseDowned = false;
  private _activeGeom?: Rectangle;

  constructor(
    private _allGeoms: RectangleCollections,
    private _hoveredGeoms: RectangleCollections,
    geomArea = ui.canvas,
  ) {
    geomArea.addEventListener('mousemove', debounce(this._mouseMoveHandler));
    geomArea.addEventListener('mousedown', () => (this._mouseDowned = true));
    geomArea.addEventListener('mouseup', () => (this._mouseDowned = false));
  }

  private _mouseMoveHandler = ({x, y}: MouseEvent) => {
    const activeGeom = getIntersectionGeom(this._allGeoms, [x, y]);
    if (activeGeom === this._activeGeom || (this._activeGeom !== undefined && this._mouseDowned)) {
      return;
    }

    const hoveredRecCollection = this._hoveredGeoms.collection;
    this._activeGeom && hoveredRecCollection.delete(this._activeGeom.id);

    this._activeGeom = this._getRectangle(activeGeom);
    this._activeGeom && hoveredRecCollection.append(this._activeGeom);
  };

  private _getRectangle(currentGeom: Rectangle | Point) {
    if (currentGeom instanceof Rectangle) {
      return currentGeom;
    }
    if (currentGeom instanceof Point) {
      return find(this._allGeoms.collection.iterate(), (rectangle) => rectangle.points.has(currentGeom.id));
    }
  }
}
