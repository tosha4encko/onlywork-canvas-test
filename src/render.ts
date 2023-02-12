import {ui} from './ui';
import {RectangleCollections} from './geoms/RectangleCollection';

export class Render {
  private _unsubscribe: () => void;
  constructor(private _rectangleCollection: RectangleCollections) {
    this._unsubscribe = this._rectangleCollection.subscribe(this._render);
  }

  private _render = () => {
    const ctx = ui.canvas.getContext('2d');

    this._rectangleCollection.collection.forEach((rectangle) => {
      ctx.fillStyle = 'transparent';
      ctx.strokeStyle = 'red';
      ctx.beginPath();

      const [first, ...other] = rectangle.points;
      const [x0, y0] = first.coord;
      ctx.moveTo(x0, y0);

      other.forEach((point) => {
        const [x0, y0] = point.coord;
        ctx.lineTo(x0, y0);
      });

      ctx.closePath();
      ctx.stroke();
    });
  };

  clear() {
    const ctx = ui.canvas.getContext('2d');
    ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height);
    this._unsubscribe();
  }
}
