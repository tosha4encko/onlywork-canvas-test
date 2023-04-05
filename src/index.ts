import {ui} from 'ui';
import {Render, RenderCursor} from 'renderer';
import {RectangleCollections, Rectangle} from 'geoms';
import {SnapshotCaretaker, HoverGeomHandler, MoveGeomHandler} from 'user-activity';
import {ChangeContourHandler} from './user-activity/change-contour-handler';

declare global {
  interface Window {
    DEBOUNCE_TIME?: number;
    snapshotsCaretaker?: SnapshotCaretaker;
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
  new ChangeContourHandler(rectangleCollection);
  new Render(rectangleCollection, activeGeomCollection);
  new RenderCursor(rectangleCollection);
  const snapshotCaretaker = new SnapshotCaretaker(rectangleCollection);

  ui.prevButton.addEventListener('click', () => {
    snapshotCaretaker.prev();
  });
  ui.nextButton.addEventListener('click', () => {
    snapshotCaretaker.next();
  });
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
