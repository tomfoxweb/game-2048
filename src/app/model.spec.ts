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

interface Movement {
  begin: Position;
  end: Position;
  cell: Cell;
}

interface ShiftTest {
  title: string;
  fnName: 'up' | 'right' | 'down' | 'left';
  movements: Movement[];
  newCells: NewCell[];
  gameMap?: GameMap;
}

describe('Model: shift: to last line', () => {
  let view: Viewable;
  let model: Model;
  let randomizer: TestRandom;
  let spyPosition: any;
  let spyCell: any;
  let spyViewSetCell: any;
  const start1: Position = { row: 1, column: 1 };
  const start2: Position = { row: 2, column: 2 };
  const cell1: NewCell = 2;
  const cell2: NewCell = 4;

  const tests: ShiftTest[] = [
    {
      title: 'shift up',
      fnName: 'up',
      movements: [
        { begin: start1, end: { row: 0, column: 1 }, cell: cell1 },
        { begin: start2, end: { row: 0, column: 2 }, cell: cell2 },
      ],
      newCells: [cell1, cell2],
    },
    {
      title: 'shift up preloaded map',
      fnName: 'up',
      movements: [
        { begin: start1, end: { row: 0, column: 1 }, cell: cell1 },
        { begin: start2, end: { row: 0, column: 2 }, cell: cell2 },
      ],
      newCells: [cell1, cell2],
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
      movements: [
        { begin: start1, end: { row: 1, column: 3 }, cell: cell1 },
        { begin: start2, end: { row: 2, column: 3 }, cell: cell2 },
      ],
      newCells: [cell1, cell2],
    },
    {
      title: 'shift right preloaded map',
      fnName: 'right',
      movements: [
        { begin: start1, end: { row: 1, column: 3 }, cell: cell1 },
        { begin: start2, end: { row: 2, column: 3 }, cell: cell2 },
      ],
      newCells: [cell1, cell2],
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
      movements: [
        { begin: start1, end: { row: 3, column: 1 }, cell: cell1 },
        { begin: start2, end: { row: 3, column: 2 }, cell: cell2 },
      ],
      newCells: [cell1, cell2],
    },
    {
      title: 'shift down preloaded map',
      fnName: 'down',
      movements: [
        { begin: start1, end: { row: 3, column: 1 }, cell: cell1 },
        { begin: start2, end: { row: 3, column: 2 }, cell: cell2 },
      ],
      newCells: [cell1, cell2],
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
      movements: [
        { begin: start1, end: { row: 1, column: 0 }, cell: cell1 },
        { begin: start2, end: { row: 2, column: 0 }, cell: cell2 },
      ],
      newCells: [cell1, cell2],
    },
    {
      title: 'shift left preloaded map',
      fnName: 'left',
      movements: [
        { begin: start1, end: { row: 1, column: 0 }, cell: cell1 },
        { begin: start2, end: { row: 2, column: 0 }, cell: cell2 },
      ],
      newCells: [cell1, cell2],
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
    model = new Model(view, randomizer);
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
      spyPosition = spyOn(randomizer, 'randomPosition').and.returnValues(
        start1,
        start2
      );
      spyCell = spyOn(randomizer, 'randomNewCell').and.returnValues(
        cell1,
        cell2
      );
      model.newGame(test.gameMap);
      spyViewSetCell.calls.reset();
      spyPosition.calls.reset();
      spyCell.calls.reset();

      const endPositions = test.movements.map((movement) => movement.end);
      randomizer.randomPosition = jasmine
        .createSpy()
        .and.returnValues(...endPositions);
      randomizer.randomNewCell = jasmine
        .createSpy()
        .and.returnValues(...test.newCells);

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

      for (const movement of test.movements) {
        expect(view.setCell).toHaveBeenCalledWith(
          movement.end.row,
          movement.end.column,
          movement.cell
        );
        expect(view.setCell).toHaveBeenCalledWith(
          movement.begin.row,
          movement.begin.column,
          0
        );
      }
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
      movements: [
        {
          begin: { row: 0, column: 1 },
          end: { row: 0, column: 1 },
          cell: cell1,
        },
        {
          begin: { row: 0, column: 2 },
          end: { row: 0, column: 2 },
          cell: cell2,
        },
      ],
      newCells: [cell1, cell2],
    },
    {
      title: 'shift right',
      fnName: 'right',
      movements: [
        {
          begin: { row: 1, column: 3 },
          end: { row: 1, column: 3 },
          cell: cell1,
        },
        {
          begin: { row: 2, column: 3 },
          end: { row: 2, column: 3 },
          cell: cell2,
        },
      ],
      newCells: [cell1, cell2],
    },
    {
      title: 'shift down',
      fnName: 'down',
      movements: [
        {
          begin: { row: 3, column: 3 },
          end: { row: 3, column: 3 },
          cell: cell1,
        },
        {
          begin: { row: 3, column: 2 },
          end: { row: 3, column: 2 },
          cell: cell2,
        },
      ],
      newCells: [cell1, cell2],
    },
    {
      title: 'shift left',
      fnName: 'left',
      movements: [
        {
          begin: { row: 1, column: 0 },
          end: { row: 1, column: 0 },
          cell: cell1,
        },
        {
          begin: { row: 3, column: 0 },
          end: { row: 3, column: 0 },
          cell: cell2,
        },
      ],
      newCells: [cell1, cell2],
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
      const endPositions = test.movements.map((movement) => movement.end);
      spyOn(randomizer, 'randomPosition').and.returnValues(...endPositions);
      spyOn(randomizer, 'randomNewCell').and.returnValues(...test.newCells);
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

describe('Model: shift: multiple move', () => {
  let view: Viewable;
  let model: Model;
  let randomizer: TestRandom;
  let spyPosition: any;
  let spyCell: any;
  let spyViewSetCell: any;
  const start1: Position = { row: 1, column: 0 };
  const start2: Position = { row: 3, column: 2 };
  const cell1: NewCell = 2;
  const cell2: NewCell = 4;

  const tests: ShiftTest[] = [
    {
      title: 'shift up',
      fnName: 'up',
      movements: [
        { begin: { row: 3, column: 0 }, end: { row: 2, column: 0 }, cell: 128 },
        { begin: { row: 2, column: 1 }, end: { row: 0, column: 1 }, cell: 256 },
        {
          begin: { row: 3, column: 1 },
          end: { row: 1, column: 1 },
          cell: 1024,
        },
        {
          begin: { row: 1, column: 2 },
          end: { row: 0, column: 2 },
          cell: 16,
        },
        {
          begin: { row: 3, column: 2 },
          end: { row: 1, column: 2 },
          cell: cell2,
        },
        {
          begin: { row: 1, column: 3 },
          end: { row: 0, column: 3 },
          cell: 64,
        },
        {
          begin: { row: 2, column: 3 },
          end: { row: 1, column: 3 },
          cell: 512,
        },
        {
          begin: { row: 3, column: 3 },
          end: { row: 2, column: 3 },
          cell: 2048,
        },
      ],
      newCells: [cell1, cell2],
      gameMap: [
        [32, 0, 0, 0],
        [0, 0, 16, 64],
        [0, 256, 0, 512],
        [128, 1024, 0, 2048],
      ],
    },
    {
      title: 'shift right',
      fnName: 'right',
      movements: [
        { begin: { row: 0, column: 2 }, end: { row: 0, column: 3 }, cell: 8 },
        { begin: { row: 0, column: 0 }, end: { row: 0, column: 2 }, cell: 32 },
        {
          begin: { row: 1, column: 1 },
          end: { row: 1, column: 2 },
          cell: 16,
        },
        {
          begin: start1,
          end: { row: 1, column: 1 },
          cell: cell1,
        },
        {
          begin: { row: 2, column: 1 },
          end: { row: 2, column: 3 },
          cell: 1024,
        },
        {
          begin: { row: 2, column: 0 },
          end: { row: 2, column: 2 },
          cell: 256,
        },
        {
          begin: start2,
          end: { row: 3, column: 3 },
          cell: cell2,
        },
        {
          begin: { row: 3, column: 0 },
          end: { row: 3, column: 2 },
          cell: 128,
        },
      ],
      newCells: [cell1, cell2],
      gameMap: [
        [32, 0, 8, 0],
        [0, 16, 0, 64],
        [256, 1024, 0, 0],
        [128, 0, 0, 0],
      ],
    },
    {
      title: 'shift down',
      fnName: 'down',
      movements: [
        { begin: start1, end: { row: 2, column: 0 }, cell: cell1 },
        { begin: { row: 0, column: 0 }, end: { row: 1, column: 0 }, cell: 32 },
        {
          begin: { row: 2, column: 1 },
          end: { row: 3, column: 1 },
          cell: 1024,
        },
        {
          begin: { row: 0, column: 1 },
          end: { row: 2, column: 1 },
          cell: 256,
        },
        {
          begin: { row: 1, column: 2 },
          end: { row: 2, column: 2 },
          cell: 16,
        },
        {
          begin: { row: 1, column: 3 },
          end: { row: 2, column: 3 },
          cell: 512,
        },
        {
          begin: { row: 0, column: 3 },
          end: { row: 1, column: 3 },
          cell: 64,
        },
      ],
      newCells: [cell1, cell2],
      gameMap: [
        [32, 256, 0, 64],
        [0, 0, 16, 512],
        [0, 1024, 0, 0],
        [128, 0, 0, 2048],
      ],
    },
    {
      title: 'shift left',
      fnName: 'left',
      movements: [
        { begin: { row: 0, column: 3 }, end: { row: 0, column: 1 }, cell: 8 },
        { begin: { row: 1, column: 3 }, end: { row: 1, column: 2 }, cell: 64 },
        {
          begin: { row: 2, column: 1 },
          end: { row: 2, column: 0 },
          cell: 1024,
        },
        {
          begin: { row: 2, column: 2 },
          end: { row: 2, column: 1 },
          cell: 2048,
        },
        {
          begin: { row: 2, column: 3 },
          end: { row: 2, column: 2 },
          cell: 256,
        },
        {
          begin: { row: 3, column: 1 },
          end: { row: 3, column: 0 },
          cell: 128,
        },
        {
          begin: start2,
          end: { row: 3, column: 1 },
          cell: cell2,
        },
        {
          begin: { row: 3, column: 3 },
          end: { row: 3, column: 2 },
          cell: 512,
        },
      ],
      newCells: [cell1, cell2],
      gameMap: [
        [32, 0, 0, 8],
        [0, 16, 0, 64],
        [0, 1024, 2048, 256],
        [0, 128, 0, 512],
      ],
    },
  ];

  beforeEach(() => {
    view = new TestView();
    spyViewSetCell = spyOn(view, 'setCell');
    randomizer = new TestRandom();
    model = new Model(view, randomizer);
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
      spyPosition = spyOn(randomizer, 'randomPosition').and.returnValues(
        start1,
        start2
      );
      spyCell = spyOn(randomizer, 'randomNewCell').and.returnValues(
        cell1,
        cell2
      );
      model.newGame(test.gameMap);
      spyViewSetCell.calls.reset();
      spyPosition.calls.reset();
      spyCell.calls.reset();

      const endPositions = test.movements.map((movement) => movement.end);
      randomizer.randomPosition = jasmine
        .createSpy()
        .and.returnValues(...endPositions);
      randomizer.randomNewCell = jasmine
        .createSpy()
        .and.returnValues(...test.newCells);

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

      for (const movement of test.movements) {
        expect(view.setCell).toHaveBeenCalledWith(
          movement.end.row,
          movement.end.column,
          movement.cell
        );
        expect(view.setCell).toHaveBeenCalledWith(
          movement.begin.row,
          movement.begin.column,
          0
        );
      }
    });
  });
});
