import {ui} from 'ui';
import {RectangleCollections} from 'geoms/rectangle-collection';
import {Render} from 'render';
import {Rectangle} from 'geoms/rectangle';
import {HoverGeomHandler} from 'user-activity/hover-geom-handler';
import {MoveGeomHandler} from 'user-activity/move-geom-handler';

declare global {
  interface Window {
    DEBOUNCE_TIME?: number;
    // rectangleCollection
    // userReaction
    // reactions
    // render
  }
}

function main() {
  const rectangleCollection = new RectangleCollections();
  const activeGeomCollection = new RectangleCollections();

  new HoverGeomHandler(rectangleCollection, activeGeomCollection);
  new MoveGeomHandler(rectangleCollection);
  new Render(rectangleCollection, activeGeomCollection);

  ui.addButton.addEventListener('click', () => {
    rectangleCollection.collection.append(
      new Rectangle([
        [50, 50],
        [50, 200],
        [200, 200],
        [200, 50],
      ]),
    );
  });

  ui.deleteButton.addEventListener('click', () => {
    // render.destruct();
  });
}

main();
