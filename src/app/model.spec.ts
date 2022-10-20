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
  endPosition1: Position;
  endPosition2: Position;
  cell1: NewCell;
  cell2: NewCell;
  gameMap?: GameMap;
}

describe('Model: shift', () => {
  let view: Viewable;
  let model: Model;
  let randomizer: TestRandom;
  let spyPosition: any;
  let spyCell: any;
  let spyViewSetCell: any;
  let startPos1: Position;
  let startPos2: Position;
  let cell1: NewCell;
  let cell2: NewCell;

  describe('to last line', () => {
    startPos1 = { row: 1, column: 1 };
    startPos2 = { row: 2, column: 2 };
    cell1 = 2;
    cell2 = 4;

    const tests: ShiftTest[] = [
      {
        title: 'shift up',
        fnName: 'up',
        endPosition1: { row: 0, column: 1 },
        endPosition2: { row: 0, column: 2 },
        cell1: 2,
        cell2: 4,
      },
      {
        title: 'shift up preloaded map',
        fnName: 'up',
        endPosition1: { row: 0, column: 1 },
        endPosition2: { row: 0, column: 2 },
        cell1: 2,
        cell2: 4,
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
        endPosition1: { row: 1, column: 3 },
        endPosition2: { row: 2, column: 3 },
        cell1: 2,
        cell2: 4,
      },
      {
        title: 'shift right preloaded map',
        fnName: 'right',
        endPosition1: { row: 1, column: 3 },
        endPosition2: { row: 2, column: 3 },
        cell1: 2,
        cell2: 4,
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
        endPosition1: { row: 3, column: 1 },
        endPosition2: { row: 3, column: 2 },
        cell1: 2,
        cell2: 4,
      },
      {
        title: 'shift down preloaded map',
        fnName: 'down',
        endPosition1: { row: 3, column: 1 },
        endPosition2: { row: 3, column: 2 },
        cell1: 2,
        cell2: 4,
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
        endPosition1: { row: 1, column: 0 },
        endPosition2: { row: 2, column: 0 },
        cell1: 2,
        cell2: 4,
      },
      {
        title: 'shift left preloaded map',
        fnName: 'left',
        endPosition1: { row: 1, column: 0 },
        endPosition2: { row: 2, column: 0 },
        cell1: 2,
        cell2: 4,
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
        startPos1,
        startPos2
      );
      spyCell = spyOn(randomizer, 'randomNewCell').and.returnValues(
        cell1,
        cell2
      );
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
          startPos1.row,
          startPos1.column,
          0
        );
        expect(view.setCell).toHaveBeenCalledWith(
          test.endPosition1.row,
          test.endPosition1.column,
          test.cell1
        );
        expect(view.setCell).toHaveBeenCalledWith(
          startPos2.row,
          startPos2.column,
          0
        );
      });
    });
  });
});
