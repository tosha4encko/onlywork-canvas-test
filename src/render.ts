import {ui} from './ui';
import {Point, Rectangle, RectangleCollections} from 'geoms';
import {pointIterator} from 'geom-utils';
import {ReactiveCollectionChangeEvent, ReactiveCollectionFires} from 'reactive-colection';
import {Subscriber} from 'observable';

const POINT_SIZE = 5;

export class Render {
  private _sleepingGeoms: RectangleCollections;
  constructor(
    private _allRectangles: RectangleCollections,
    private _hoveredGeoms: RectangleCollections,
    private _ui = ui,
  ) {
    const allRectangles = this._allRectangles.collection;
    const hoveredRectangles = this._hoveredGeoms.collection;
    this._sleepingGeoms = new RectangleCollections([...allRectangles.iterate()]);

    allRectangles.subscribe(this._allRectangleChangeHandler);
    hoveredRectangles.subscribe(this._hoveredRectangleChangeHandler);

    new _RenderCollection(this._hoveredGeoms, 'orange', this._ui.dirtyCanvas);
    new _RenderCollection(this._sleepingGeoms, 'blue', this._ui.canvas);
  }

  private _allRectangleChangeHandler = ({type, objId}: ReactiveCollectionChangeEvent) => {
    const allRectangles = this._allRectangles.collection;
    const hoveredRectangles = this._hoveredGeoms.collection;
    const sleepingRectangle = this._sleepingGeoms.collection;

    switch (type) {
      case ReactiveCollectionFires.Append:
        if (!hoveredRectangles.has(objId)) {
          sleepingRectangle.append(allRectangles.get(objId));
        }
        break;
      case ReactiveCollectionFires.Delete:
        sleepingRectangle.delete(objId);
        break;
      case ReactiveCollectionFires.Clear:
        sleepingRectangle.clear();
        break;
    }
  };

  private _hoveredRectangleChangeHandler = ({type, objId}: ReactiveCollectionChangeEvent) => {
    const allRectangles = this._allRectangles.collection;
    const sleepingRectangle = this._sleepingGeoms.collection;

    switch (type) {
      case ReactiveCollectionFires.Append:
        sleepingRectangle.delete(objId);
        break;
      case ReactiveCollectionFires.Delete:
        sleepingRectangle.append(allRectangles.get(objId));
        break;
    }
  };
}

export class _RenderCollection {
  constructor(private _rectangles: RectangleCollections, private _color: string, private _canvas = ui.canvas) {
    // Подписываемся на точки геометрий, которые уже есть в коллекции
    let pointsSubscribers: Record<number, Subscriber> = {};
    for (const point of pointIterator(this._rectangles)) {
      pointsSubscribers[point.id] = point.subscribe(this._render);
    }

    // Подписываемся изменения в коллекции
    this._rectangles.collection.subscribe(({type, objId}) => {
      const rect = this._rectangles.collection.get(objId);
      switch (type) {
        case ReactiveCollectionFires.Append:
          this._render();
          for (const point of pointIterator(rect)) {
            pointsSubscribers[point.id] = point.subscribe(this._render);
          }
          break;
        case ReactiveCollectionFires.Delete:
          this._render();
          for (const point of pointIterator(rect)) {
            pointsSubscribers[point.id].unsubscribe();
            delete pointsSubscribers[point.id];
          }
          break;
        case ReactiveCollectionFires.Clear:
          this._render();
          for (const pointId in pointsSubscribers) {
            pointsSubscribers[pointId].unsubscribe();
          }
          pointsSubscribers = {};
          break;
      }
    });
    this._render();
  }

  private _render = () => {
    const ctx = this._canvas.getContext('2d');
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    for (let rectangle of this._rectangles.collection.iterate()) {
      this._rectangleRender(rectangle, this._canvas);
    }
    for (let point of pointIterator(this._rectangles)) {
      this._pointRender(point, this._canvas);
    }
  };

  private _rectangleRender = (rectangle: Rectangle, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');

    const [first, ...other] = rectangle.points.iterate();
    const [x0, y0] = first.coord;

    ctx.beginPath();
    ctx.strokeStyle = this._color;
    ctx.moveTo(x0, y0);
    other.forEach((point) => {
      const [x0, y0] = point.coord;
      ctx.lineTo(x0, y0);
    });

    ctx.closePath();
    ctx.stroke();
  };

  private _pointRender = (point: Point, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = this._color;
    ctx.arc(...point.coord, POINT_SIZE, 0, 2 * Math.PI, true);
    ctx.fill();
  };
}
