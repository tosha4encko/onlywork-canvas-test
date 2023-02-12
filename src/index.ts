import {ui} from './ui';
import {RectangleCollections} from './geoms/RectangleCollection';
import {Render} from './render';
import {Rectangle} from './geoms/Rectangle';

function main() {
  const rectangleCollection = new RectangleCollections();
  const render = new Render(rectangleCollection);

  ui.addButton.addEventListener('click', () => {
    rectangleCollection.push(
      new Rectangle([
        [50, 50],
        [50, 200],
        [200, 200],
        [200, 50],
      ]),
    );
  });

  ui.deleteButton.addEventListener('click', () => {
    render.clear();
  });
}

main();
