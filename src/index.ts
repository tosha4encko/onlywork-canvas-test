import {ui} from './ui';
import {RectangleCollections} from './geoms/rectangle-collection';
import {Render} from './render';
import {Rectangle} from './geoms/Rectangle';
import {UserActions} from './user-actions';
import {Reactions} from './reaction';

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
  const userReaction = new UserActions(rectangleCollection);
  const reactions = new Reactions(rectangleCollection, userReaction);
  const render = new Render(rectangleCollection, userReaction);

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
    render.destruct();
  });
}

main();
