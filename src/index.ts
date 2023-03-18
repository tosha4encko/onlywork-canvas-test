import {ui} from './ui';
import {RectangleCollections} from './geoms/rectangle-collection';
import {Render} from './render';
import {Rectangle} from './geoms/Rectangle';
import {ActionsWithGeom} from './user-activity/actions-with-geom';
import {Reactions} from './user-activity/reaction';
import {UserRectangleCollection} from './user-activity/user-rectangle-collection';

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
  const userReaction = new ActionsWithGeom(rectangleCollection);
  const userActionsCollection = new UserRectangleCollection(rectangleCollection, userReaction);
  const reactions = new Reactions(userReaction);
  const render = new Render(userActionsCollection, reactions);

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
