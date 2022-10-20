import {
  Cell,
  Column,
  ColumnValues,
  GameMap,
  NewCell,
  Position,
  Row,
  RowValues,
} from './cell';
import { Model } from './model';
import { Randomable } from './randomable';
import { Viewable } from './viewable';

class TestView implements Viewable {
  setCell(row: Row, column: Column, cell: Cell): void {}
}

class TestRandom implements Randomable {
  randomPosition(emptyPositions: Position[]): Position {
    return emptyPositions[0];
  }

  randomNewCell(): NewCell {
    return 2;
  }
}

interface NewGameTest {
  title: string;
  position1: Position;
  position2: Position;
  cell1: NewCell;
  cell2: NewCell;
  gameMap?: GameMap;
}

describe('Model: new game', () => {
  const tests: NewGameTest[] = [
    {
      title: 'add two 2 cells',
      position1: { row: 1, column: 2 },
      position2: { row: 3, column: 0 },
      cell1: 2,
      cell2: 2,
    },
    {
      title: 'add two 4 cells',
      position1: { row: 2, column: 3 },
      position2: { row: 0, column: 1 },
      cell1: 4,
      cell2: 4,
    },
    {
      title: 'add 2 and 4 cells',
      position1: { row: 3, column: 1 },
      position2: { row: 1, column: 2 },
      cell1: 2,
      cell2: 4,
    },
    {
      title: 'add 4 and 2 cells',
      position1: { row: 0, column: 0 },
      position2: { row: 2, column: 3 },
      cell1: 4,
      cell2: 2,
    },
    {
      title: 'add 2 and 2 cells on preload map',
      position1: { row: 0, column: 0 },
      position2: { row: 3, column: 3 },
      cell1: 2,
      cell2: 2,
      gameMap: [
        [0, 8, 2, 4],
        [16, 0, 32, 64],
        [0, 128, 0, 4],
        [512, 256, 1024, 0],
      ],
    },
    {
      title: 'add 4 and 4 cells on preload map',
      position1: { row: 1, column: 1 },
      position2: { row: 2, column: 2 },
      cell1: 4,
      cell2: 4,
      gameMap: [
        [2048, 16, 2, 4],
        [16, 0, 64, 64],
        [0, 128, 0, 4],
        [512, 4096, 256, 0],
      ],
    },
    {
      title: 'add 2 and 4 cells on preload map',
      position1: { row: 2, column: 0 },
      position2: { row: 1, column: 3 },
      cell1: 2,
      cell2: 4,
      gameMap: [
        [0, 0, 0, 2],
        [16, 0, 32, 0],
        [0, 2, 0, 4],
        [8, 4096, 256, 0],
      ],
    },
    {
      title: 'add 4 and 2 cells on preload map',
      position1: { row: 3, column: 2 },
      position2: { row: 0, column: 2 },
      cell1: 4,
      cell2: 2,
      gameMap: [
        [0, 0, 0, 2],
        [16, 0, 32, 0],
        [0, 2, 0, 4],
        [8, 4096, 0, 8],
      ],
    },
  ];
  let view: Viewable;
  let model: Model;
  let randomizer: TestRandom;
  let testingMap: Cell[][];
  let spyPosition: any;

  beforeEach(() => {
    view = new TestView();
    spyOn(view, 'setCell');
    testingMap = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    randomizer = new TestRandom();
  });

  tests.forEach((test) => {
    it(test.title, () => {
      spyPosition = spyOn(randomizer, 'randomPosition').and.returnValues(
        test.position1,
        test.position2
      );
      spyOn(randomizer, 'randomNewCell').and.returnValues(
        test.cell1,
        test.cell2
      );
      testingMap[test.position1.row][test.position1.column] = test.cell1;
      testingMap[test.position2.row][test.position2.column] = test.cell2;
      model = new Model(view, randomizer);
      model.newGame();
      for (const row of RowValues) {
        for (const column of ColumnValues) {
          expect(view.setCell).toHaveBeenCalledWith(
            row,
            column,
            testingMap[row][column]
          );
        }
      }
      expect(spyPosition).toHaveBeenCalled();
      expect(randomizer.randomNewCell).toHaveBeenCalledTimes(2);
    });
  });
});

interface ShiftTest {
  title: string;
  fnName: 'up' | 'right' | 'down' | 'left';
  startPosition1: Position;
  startPosition2: Position;
  endPosition1: Position;
  endPosition2: Position;
  cell1: NewCell;
  cell2: NewCell;
  gameMap?: GameMap;
}

describe('Model: shift: to last line', () => {
  let view: Viewable;
  let model: Model;
  let randomizer: TestRandom;
  let spyPosition: any;
  let spyCell: any;
  let spyViewSetCell: any;
  const startPosition1: Position = { row: 1, column: 1 };
  const startPosition2: Position = { row: 2, column: 2 };
  const cell1: NewCell = 2;
  const cell2: NewCell = 4;

  const tests: ShiftTest[] = [
    {
      title: 'shift up',
      fnName: 'up',
      startPosition1: startPosition1,
      startPosition2: startPosition2,
      endPosition1: { row: 0, column: 1 },
      endPosition2: { row: 0, column: 2 },
      cell1: cell1,
      cell2: cell2,
    },
    {
      title: 'shift up preloaded map',
      fnName: 'up',
      startPosition1: startPosition1,
      startPosition2: startPosition2,
      endPosition1: { row: 0, column: 1 },
      endPosition2: { row: 0, column: 2 },
      cell1: cell1,
      cell2: cell2,
      gameMap: [
        [32, 0, 0, 2],
        [16, 0, 0, 8],
        [2, 0, 0, 4],
        [8, 0, 0, 8],
      ],
    },
    {
      title: 'shift right',
      fnName: 'right',
      startPosition1: startPosition1,
      startPosition2: startPosition2,
      endPosition1: { row: 1, column: 3 },
      endPosition2: { row: 2, column: 3 },
      cell1: cell1,
      cell2: cell2,
    },
    {
      title: 'shift right preloaded map',
      fnName: 'right',
      startPosition1: startPosition1,
      startPosition2: startPosition2,
      endPosition1: { row: 1, column: 3 },
      endPosition2: { row: 2, column: 3 },
      cell1: cell1,
      cell2: cell2,
      gameMap: [
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [8, 4096, 2, 8],
      ],
    },
    {
      title: 'shift down',
      fnName: 'down',
      startPosition1: startPosition1,
      startPosition2: startPosition2,
      endPosition1: { row: 3, column: 1 },
      endPosition2: { row: 3, column: 2 },
      cell1: cell1,
      cell2: cell2,
    },
    {
      title: 'shift down preloaded map',
      fnName: 'down',
      startPosition1: startPosition1,
      startPosition2: startPosition2,
      endPosition1: { row: 3, column: 1 },
      endPosition2: { row: 3, column: 2 },
      cell1: cell1,
      cell2: cell2,
      gameMap: [
        [0, 0, 0, 0],
        [16, 0, 0, 4],
        [32, 0, 0, 8],
        [8, 0, 0, 8],
      ],
    },
    {
      title: 'shift left',
      fnName: 'left',
      startPosition1: startPosition1,
      startPosition2: startPosition2,
      endPosition1: { row: 1, column: 0 },
      endPosition2: { row: 2, column: 0 },
      cell1: cell1,
      cell2: cell2,
    },
    {
      title: 'shift left preloaded map',
      fnName: 'left',
      startPosition1: startPosition1,
      startPosition2: startPosition2,
      endPosition1: { row: 1, column: 0 },
      endPosition2: { row: 2, column: 0 },
      cell1: cell1,
      cell2: cell2,
      gameMap: [
        [8, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [8, 2, 16, 0],
      ],
    },
  ];

  beforeEach(() => {
    view = new TestView();
    spyViewSetCell = spyOn(view, 'setCell');
    randomizer = new TestRandom();
    spyPosition = spyOn(randomizer, 'randomPosition').and.returnValues(
      startPosition1,
      startPosition2
    );
    spyCell = spyOn(randomizer, 'randomNewCell').and.returnValues(cell1, cell2);
    model = new Model(view, randomizer);
    model.newGame();
    spyViewSetCell.calls.reset();
    spyPosition.calls.reset();
    spyCell.calls.reset();
  });

  afterEach(() => {
    spyViewSetCell.calls.reset();
    spyPosition.calls.reset();
    spyCell.calls.reset();
  });

  afterAll(() => {
    spyViewSetCell.calls.reset();
    spyPosition.calls.reset();
    spyCell.calls.reset();
  });

  tests.forEach((test) => {
    it(test.title, () => {
      randomizer.randomPosition = jasmine
        .createSpy()
        .and.returnValues(test.endPosition1, test.endPosition2);
      randomizer.randomNewCell = jasmine
        .createSpy()
        .and.returnValues(test.cell1, test.cell2);

      switch (test.fnName) {
        case 'up':
          model.shiftUp();
          break;
        case 'right':
          model.shiftRight();
          break;
        case 'down':
          model.shiftDown();
          break;
        case 'left':
          model.shiftLeft();
          break;
      }

      expect(view.setCell).toHaveBeenCalledWith(
        test.endPosition1.row,
        test.endPosition1.column,
        test.cell1
      );
      expect(view.setCell).toHaveBeenCalledWith(
        startPosition1.row,
        startPosition1.column,
        0
      );
      expect(view.setCell).toHaveBeenCalledWith(
        test.endPosition2.row,
        test.endPosition2.column,
        test.cell2
      );
      expect(view.setCell).toHaveBeenCalledWith(
        startPosition2.row,
        startPosition2.column,
        0
      );
    });
  });
});

describe('Model: shift: already on last line', () => {
  let view: Viewable;
  let model: Model;
  let randomizer: TestRandom;
  let spyViewSetCell: any;
  let cell1: NewCell;
  let cell2: NewCell;
  cell1 = 2;
  cell2 = 4;

  const tests: ShiftTest[] = [
    {
      title: 'shift up',
      fnName: 'up',
      startPosition1: { row: 0, column: 1 },
      startPosition2: { row: 0, column: 2 },
      endPosition1: { row: 0, column: 1 },
      endPosition2: { row: 0, column: 2 },
      cell1: cell1,
      cell2: cell2,
    },
    {
      title: 'shift right',
      fnName: 'right',
      startPosition1: { row: 0, column: 3 },
      startPosition2: { row: 1, column: 3 },
      endPosition1: { row: 0, column: 3 },
      endPosition2: { row: 1, column: 3 },
      cell1: cell1,
      cell2: cell2,
    },
    {
      title: 'shift down',
      fnName: 'down',
      startPosition1: { row: 3, column: 2 },
      startPosition2: { row: 3, column: 3 },
      endPosition1: { row: 3, column: 2 },
      endPosition2: { row: 3, column: 3 },
      cell1: cell1,
      cell2: cell2,
    },
  ];

  beforeEach(() => {
    view = new TestView();
    spyViewSetCell = spyOn(view, 'setCell');
    randomizer = new TestRandom();
    model = new Model(view, randomizer);
  });

  tests.forEach((test) => {
    it(test.title, () => {
      spyOn(randomizer, 'randomPosition').and.returnValues(
        test.endPosition1,
        test.endPosition2
      );
      spyOn(randomizer, 'randomNewCell').and.returnValues(
        test.cell1,
        test.cell2
      );
      model.newGame();
      spyViewSetCell.calls.reset();
      switch (test.fnName) {
        case 'up':
          model.shiftUp();
          break;
        case 'right':
          model.shiftRight();
          break;
        case 'down':
          model.shiftDown();
          break;
        case 'left':
          model.shiftLeft();
          break;
      }

      expect(view.setCell).not.toHaveBeenCalled();
    });
  });
});
