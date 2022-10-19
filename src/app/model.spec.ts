import {
  Cell,
  Column,
  ColumnValues,
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
}

describe('Model: shift', () => {
  let view: Viewable;
  let model: Model;
  let randomizer: TestRandom;
  let spyPosition: any;
  let spyCell: any;
  let spyViewSetCell: any;
  const startPos1: Position = { row: 1, column: 1 };
  const startPos2: Position = { row: 2, column: 2 };
  const cell1: Cell = 2;
  const cell2: Cell = 4;

  const tests: ShiftTest[] = [
    {
      title: 'shift up',
      fnName: 'up',
      endPosition1: { row: 0, column: 1 },
      endPosition2: { row: 0, column: 2 },
      cell1: 2,
      cell2: 4,
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
