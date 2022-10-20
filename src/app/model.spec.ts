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
  randomPosition(emptyPositions: Position[]): Position | null {
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

interface NewCellPosition {
  position: Position;
  newCell: NewCell;
}

interface ShiftTest {
  title: string;
  fnName: 'up' | 'right' | 'down' | 'left';
  newCellsNewGame: NewCellPosition[];
  newCellsAfterShift: NewCellPosition[];
  gameMapPreload?: GameMap;
  gameMapAfterShift: GameMap;
}

describe('Model: shift', () => {
  let view: Viewable;
  let model: Model;
  let randomizer: TestRandom;
  let spyPosition: any;
  let spyCell: any;
  let spyViewSetCell: any;

  const tests: ShiftTest[] = [
    {
      title: 'shift up',
      fnName: 'up',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 2, column: 2 }, newCell: 2 },
        { position: { row: 3, column: 3 }, newCell: 2 },
      ],
      gameMapAfterShift: [
        [0, 2, 4, 0],
        [0, 0, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 2],
      ],
    },
    {
      title: 'shift up preloaded map',
      fnName: 'up',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 3, column: 1 }, newCell: 2 },
        { position: { row: 3, column: 2 }, newCell: 4 },
      ],
      gameMapPreload: [
        [32, 0, 0, 2],
        [16, 0, 0, 8],
        [2, 0, 0, 4],
        [8, 0, 0, 8],
      ],
      gameMapAfterShift: [
        [32, 2, 4, 2],
        [16, 0, 0, 8],
        [2, 0, 0, 4],
        [8, 2, 4, 8],
      ],
    },
    {
      title: 'shift up already on last line',
      fnName: 'up',
      newCellsNewGame: [
        { position: { row: 0, column: 1 }, newCell: 2 },
        { position: { row: 0, column: 2 }, newCell: 2 },
      ],
      newCellsAfterShift: [
        { position: { row: 2, column: 0 }, newCell: 2 },
        { position: { row: 3, column: 3 }, newCell: 2 },
      ],
      gameMapAfterShift: [
        [0, 2, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    },
    {
      title: 'shift up multiple move',
      fnName: 'up',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 2, column: 0 }, newCell: 2 },
        { position: { row: 3, column: 2 }, newCell: 2 },
      ],
      gameMapPreload: [
        [0, 0, 16, 0],
        [32, 0, 0, 0],
        [0, 4, 0, 512],
        [16, 8, 0, 1024],
      ],
      gameMapAfterShift: [
        [32, 2, 16, 512],
        [16, 4, 4, 1024],
        [2, 8, 0, 0],
        [0, 0, 2, 0],
      ],
    },
    {
      title: 'shift up no move',
      fnName: 'up',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 2, column: 0 }, newCell: 2 },
        { position: { row: 3, column: 2 }, newCell: 2 },
      ],
      gameMapPreload: [
        [2, 32, 16, 8],
        [32, 0, 8, 2],
        [2, 4, 0, 512],
        [16, 8, 16, 1024],
      ],
      gameMapAfterShift: [
        [2, 32, 16, 8],
        [32, 2, 8, 2],
        [2, 4, 4, 512],
        [16, 8, 16, 1024],
      ],
    },
    {
      title: 'shift up one new cell',
      fnName: 'up',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 3, column: 3 }, newCell: 2 },
        { position: { row: 3, column: 2 }, newCell: 2 },
      ],
      gameMapPreload: [
        [4, 32, 16, 0],
        [32, 0, 8, 128],
        [2, 4, 0, 512],
        [16, 8, 64, 1024],
      ],
      gameMapAfterShift: [
        [4, 32, 16, 128],
        [32, 2, 8, 512],
        [2, 4, 4, 1024],
        [16, 8, 64, 2],
      ],
    },
    {
      title: 'shift right',
      fnName: 'right',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 0, column: 0 }, newCell: 4 },
        { position: { row: 1, column: 1 }, newCell: 4 },
      ],
      gameMapAfterShift: [
        [4, 0, 0, 0],
        [0, 4, 0, 2],
        [0, 0, 0, 4],
        [0, 0, 0, 0],
      ],
    },
    {
      title: 'shift right preloaded map',
      fnName: 'right',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 1, column: 2 }, newCell: 4 },
        { position: { row: 2, column: 0 }, newCell: 2 },
      ],
      gameMapPreload: [
        [32, 16, 8, 64],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [8, 64, 128, 8],
      ],
      gameMapAfterShift: [
        [32, 16, 8, 64],
        [0, 0, 4, 2],
        [2, 0, 0, 4],
        [8, 64, 128, 8],
      ],
    },
    {
      title: 'shift right already on last line',
      fnName: 'right',
      newCellsNewGame: [
        { position: { row: 1, column: 3 }, newCell: 2 },
        { position: { row: 2, column: 3 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 1, column: 2 }, newCell: 4 },
        { position: { row: 3, column: 3 }, newCell: 2 },
      ],
      gameMapAfterShift: [
        [0, 0, 0, 0],
        [0, 0, 4, 2],
        [0, 0, 0, 4],
        [0, 0, 0, 2],
      ],
    },
    {
      title: 'shift right multiple move',
      fnName: 'right',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 0, column: 0 }, newCell: 2 },
        { position: { row: 1, column: 0 }, newCell: 4 },
      ],
      gameMapPreload: [
        [0, 32, 0, 8],
        [8, 0, 64, 0],
        [128, 16, 0, 0],
        [2, 0, 256, 128],
      ],
      gameMapAfterShift: [
        [2, 0, 32, 8],
        [4, 8, 2, 64],
        [0, 128, 16, 4],
        [0, 2, 256, 128],
      ],
    },
    {
      title: 'shift right no move',
      fnName: 'right',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      gameMapPreload: [
        [4, 32, 2, 8],
        [8, 0, 64, 2],
        [128, 16, 0, 2],
        [2, 4, 256, 128],
      ],
      gameMapAfterShift: [
        [4, 32, 2, 8],
        [8, 2, 64, 2],
        [128, 16, 4, 2],
        [2, 4, 256, 128],
      ],
    },
    {
      title: 'shift right one new cell',
      fnName: 'right',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 0, column: 0 }, newCell: 4 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      gameMapPreload: [
        [0, 32, 4, 8],
        [8, 0, 64, 2],
        [128, 16, 0, 64],
        [2, 4, 256, 128],
      ],
      gameMapAfterShift: [
        [4, 32, 4, 8],
        [8, 2, 64, 2],
        [128, 16, 4, 64],
        [2, 4, 256, 128],
      ],
    },
    {
      title: 'shift down',
      fnName: 'down',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 0, column: 3 }, newCell: 4 },
        { position: { row: 1, column: 0 }, newCell: 2 },
      ],
      gameMapAfterShift: [
        [0, 0, 0, 4],
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 2, 4, 0],
      ],
    },
    {
      title: 'shift down preloaded map',
      fnName: 'down',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 0, column: 1 }, newCell: 4 },
        { position: { row: 1, column: 2 }, newCell: 2 },
      ],
      gameMapPreload: [
        [32, 0, 0, 512],
        [64, 0, 0, 128],
        [16, 0, 0, 64],
        [8, 0, 0, 16],
      ],
      gameMapAfterShift: [
        [32, 4, 0, 512],
        [64, 0, 2, 128],
        [16, 0, 0, 64],
        [8, 2, 4, 16],
      ],
    },
    {
      title: 'shift down already on last line',
      fnName: 'down',
      newCellsNewGame: [
        { position: { row: 3, column: 1 }, newCell: 4 },
        { position: { row: 3, column: 2 }, newCell: 2 },
      ],
      newCellsAfterShift: [
        { position: { row: 0, column: 3 }, newCell: 2 },
        { position: { row: 1, column: 2 }, newCell: 4 },
      ],
      gameMapAfterShift: [
        [0, 0, 0, 2],
        [0, 0, 4, 0],
        [0, 0, 0, 0],
        [0, 4, 2, 0],
      ],
    },
    {
      title: 'shift down multiple move',
      fnName: 'down',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 1, column: 3 }, newCell: 4 },
        { position: { row: 0, column: 1 }, newCell: 2 },
      ],
      gameMapPreload: [
        [8, 128, 0, 256],
        [0, 0, 0, 0],
        [2, 64, 0, 0],
        [8, 0, 16, 32],
      ],
      gameMapAfterShift: [
        [0, 2, 0, 0],
        [8, 128, 0, 4],
        [2, 2, 4, 256],
        [8, 64, 16, 32],
      ],
    },
    {
      title: 'shift down no move',
      fnName: 'down',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      gameMapPreload: [
        [8, 128, 2, 256],
        [4, 0, 32, 4],
        [2, 64, 0, 16],
        [8, 2, 16, 32],
      ],
      gameMapAfterShift: [
        [8, 128, 2, 256],
        [4, 2, 32, 4],
        [2, 64, 4, 16],
        [8, 2, 16, 32],
      ],
    },
    {
      title: 'shift down one new cell',
      fnName: 'down',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 0, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      gameMapPreload: [
        [8, 128, 4, 256],
        [4, 0, 32, 2],
        [2, 64, 0, 128],
        [8, 0, 16, 32],
      ],
      gameMapAfterShift: [
        [8, 2, 4, 256],
        [4, 128, 32, 2],
        [2, 2, 4, 128],
        [8, 64, 16, 32],
      ],
    },
    {
      title: 'shift left',
      fnName: 'left',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 1, column: 2 }, newCell: 4 },
        { position: { row: 2, column: 2 }, newCell: 2 },
      ],
      gameMapAfterShift: [
        [0, 0, 0, 0],
        [2, 0, 4, 0],
        [4, 0, 2, 0],
        [0, 0, 0, 0],
      ],
    },
    {
      title: 'shift left preloaded map',
      fnName: 'left',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 1, column: 3 }, newCell: 4 },
        { position: { row: 2, column: 1 }, newCell: 2 },
      ],
      gameMapPreload: [
        [32, 16, 8, 64],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [8, 128, 32, 16],
      ],
      gameMapAfterShift: [
        [32, 16, 8, 64],
        [2, 0, 0, 4],
        [4, 2, 0, 0],
        [8, 128, 32, 16],
      ],
    },
    {
      title: 'shift left already on last line',
      fnName: 'left',
      newCellsNewGame: [
        { position: { row: 1, column: 0 }, newCell: 2 },
        { position: { row: 2, column: 0 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 0, column: 0 }, newCell: 4 },
        { position: { row: 3, column: 3 }, newCell: 4 },
      ],
      gameMapAfterShift: [
        [4, 0, 0, 0],
        [2, 0, 0, 0],
        [4, 0, 0, 0],
        [0, 0, 0, 4],
      ],
    },
    {
      title: 'shift left multiple move',
      fnName: 'left',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 2, column: 3 }, newCell: 2 },
        { position: { row: 3, column: 3 }, newCell: 4 },
      ],
      gameMapPreload: [
        [0, 0, 2, 4],
        [0, 0, 16, 0],
        [64, 0, 0, 32],
        [0, 1024, 0, 0],
      ],
      gameMapAfterShift: [
        [2, 4, 0, 0],
        [2, 16, 0, 0],
        [64, 4, 32, 2],
        [1024, 0, 0, 4],
      ],
    },
    {
      title: 'shift left no move',
      fnName: 'left',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      gameMapPreload: [
        [2, 4, 8, 4],
        [32, 0, 16, 2],
        [64, 128, 0, 32],
        [2, 1024, 4, 8],
      ],
      gameMapAfterShift: [
        [2, 4, 8, 4],
        [32, 2, 16, 2],
        [64, 128, 4, 32],
        [2, 1024, 4, 8],
      ],
    },
    {
      title: 'shift left one new cell',
      fnName: 'left',
      newCellsNewGame: [
        { position: { row: 1, column: 1 }, newCell: 2 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      newCellsAfterShift: [
        { position: { row: 1, column: 3 }, newCell: 4 },
        { position: { row: 2, column: 2 }, newCell: 4 },
      ],
      gameMapPreload: [
        [16, 8, 2, 4],
        [0, 0, 16, 128],
        [64, 256, 0, 32],
        [2, 1024, 8, 4],
      ],
      gameMapAfterShift: [
        [16, 8, 2, 4],
        [2, 16, 128, 4],
        [64, 256, 4, 32],
        [2, 1024, 8, 4],
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
        test.newCellsNewGame[0].position,
        test.newCellsNewGame[1].position
      );
      spyCell = spyOn(randomizer, 'randomNewCell').and.returnValues(
        test.newCellsNewGame[0].newCell,
        test.newCellsNewGame[1].newCell
      );
      model.newGame(test.gameMapPreload);
      spyViewSetCell.calls.reset();
      spyPosition.calls.reset();
      spyCell.calls.reset();

      randomizer.randomPosition = jasmine
        .createSpy()
        .and.returnValues(
          test.newCellsAfterShift[0].position,
          test.newCellsAfterShift[1].position
        );
      randomizer.randomNewCell = jasmine
        .createSpy()
        .and.returnValues(
          test.newCellsAfterShift[0].newCell,
          test.newCellsAfterShift[1].newCell
        );

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

      for (const row of RowValues) {
        for (const column of ColumnValues) {
          expect(view.setCell).toHaveBeenCalledWith(
            row,
            column,
            test.gameMapAfterShift[row][column]
          );
        }
      }
    });
  });
});
