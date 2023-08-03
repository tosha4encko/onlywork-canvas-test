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
  const snapshotCaretaker = new SnapshotCaretaker(rectangleCollection);

  // todo garbage-collect
  new HoverGeomHandler(rectangleCollection, activeGeomCollection);
  new MoveGeomHandler(rectangleCollection, snapshotCaretaker);
  new ChangeContourHandler(rectangleCollection, snapshotCaretaker);
  new Render(rectangleCollection, activeGeomCollection);
  new RenderCursor(rectangleCollection);

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
    snapshotCaretaker.record();
  });

  ui.deleteButton.addEventListener('click', () => {
    // render.destruct();
  });
}

main();
