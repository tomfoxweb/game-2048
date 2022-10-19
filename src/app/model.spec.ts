import { Cell, Column, ColumnValues, NewCell, Row, RowValues } from './cell';
import { Model } from './model';
import { Randomable } from './randomable';
import { Viewable } from './viewable';

class TestView implements Viewable {
  setCell(row: Row, column: Column, cell: Cell): void {}
}

class TestRandom implements Randomable {
  randomRow(): Row {
    return 0;
  }

  randomColumn(): Column {
    return 0;
  }

  randomNewCell(): NewCell {
    return 2;
  }
}

describe('Model: new game', () => {
  let view: Viewable;
  let model: Model;
  let randomizer: TestRandom;
  let firstRow: Row;
  let firstColumn: Column;
  let firstNewCell: NewCell;
  let secondRow: Row;
  let secondColumn: Column;
  let secondNewCell: NewCell;
  let testingMap: Cell[][];

  beforeEach(() => {
    view = new TestView();
    spyOn(view, 'setCell');
    randomizer = new TestRandom();
  });

  describe('add two 2 cells', () => {
    beforeEach(() => {
      testingMap = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      firstRow = 1;
      firstColumn = 2;
      firstNewCell = 2;
      secondRow = 3;
      secondColumn = 0;
      secondNewCell = 2;

      spyOn(randomizer, 'randomRow').and.returnValues(firstRow, secondRow);
      spyOn(randomizer, 'randomColumn').and.returnValues(
        firstColumn,
        secondColumn
      );
      spyOn(randomizer, 'randomNewCell').and.returnValues(
        firstNewCell,
        secondNewCell
      );
      testingMap[firstRow][firstColumn] = firstNewCell;
      testingMap[secondRow][secondColumn] = secondNewCell;
      model = new Model(view, randomizer);
      model.newGame();
    });

    it('should add two 2 cells', () => {
      for (const row of RowValues) {
        for (const column of ColumnValues) {
          expect(view.setCell).toHaveBeenCalledWith(
            row,
            column,
            testingMap[row][column]
          );
        }
      }
    });

    it('should call randomRow, randomColumn and RandomNewCell', () => {
      expect(randomizer.randomRow).toHaveBeenCalledTimes(2);
      expect(randomizer.randomColumn).toHaveBeenCalledTimes(2);
      expect(randomizer.randomNewCell).toHaveBeenCalledTimes(2);
    });
  });

  describe('add two 4 cells', () => {
    beforeEach(() => {
      testingMap = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      firstRow = 2;
      firstColumn = 3;
      firstNewCell = 4;
      secondRow = 1;
      secondColumn = 1;
      secondNewCell = 4;

      spyOn(randomizer, 'randomRow').and.returnValues(firstRow, secondRow);
      spyOn(randomizer, 'randomColumn').and.returnValues(
        firstColumn,
        secondColumn
      );
      spyOn(randomizer, 'randomNewCell').and.returnValues(
        firstNewCell,
        secondNewCell
      );
      testingMap[firstRow][firstColumn] = firstNewCell;
      testingMap[secondRow][secondColumn] = secondNewCell;
      model = new Model(view, randomizer);
      model.newGame();
    });

    it('should add two 4 cells', () => {
      for (const row of RowValues) {
        for (const column of ColumnValues) {
          expect(view.setCell).toHaveBeenCalledWith(
            row,
            column,
            testingMap[row][column]
          );
        }
      }
    });

    it('should call randomRow, randomColumn and RandomNewCell', () => {
      expect(randomizer.randomRow).toHaveBeenCalledTimes(2);
      expect(randomizer.randomColumn).toHaveBeenCalledTimes(2);
      expect(randomizer.randomNewCell).toHaveBeenCalledTimes(2);
    });
  });

  describe('add 2 and 4 cells', () => {
    beforeEach(() => {
      testingMap = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      firstRow = 3;
      firstColumn = 1;
      firstNewCell = 2;
      secondRow = 0;
      secondColumn = 2;
      secondNewCell = 4;

      spyOn(randomizer, 'randomRow').and.returnValues(firstRow, secondRow);
      spyOn(randomizer, 'randomColumn').and.returnValues(
        firstColumn,
        secondColumn
      );
      spyOn(randomizer, 'randomNewCell').and.returnValues(
        firstNewCell,
        secondNewCell
      );
      testingMap[firstRow][firstColumn] = firstNewCell;
      testingMap[secondRow][secondColumn] = secondNewCell;
      model = new Model(view, randomizer);
      model.newGame();
    });

    it('should add 2 and 4 cells', () => {
      for (const row of RowValues) {
        for (const column of ColumnValues) {
          expect(view.setCell).toHaveBeenCalledWith(
            row,
            column,
            testingMap[row][column]
          );
        }
      }
    });

    it('should call randomRow, randomColumn and RandomNewCell', () => {
      expect(randomizer.randomRow).toHaveBeenCalledTimes(2);
      expect(randomizer.randomColumn).toHaveBeenCalledTimes(2);
      expect(randomizer.randomNewCell).toHaveBeenCalledTimes(2);
    });
  });

  describe('add 4 and 2 cells', () => {
    beforeEach(() => {
      testingMap = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      firstRow = 0;
      firstColumn = 0;
      firstNewCell = 4;
      secondRow = 2;
      secondColumn = 3;
      secondNewCell = 2;

      spyOn(randomizer, 'randomRow').and.returnValues(firstRow, secondRow);
      spyOn(randomizer, 'randomColumn').and.returnValues(
        firstColumn,
        secondColumn
      );
      spyOn(randomizer, 'randomNewCell').and.returnValues(
        firstNewCell,
        secondNewCell
      );
      testingMap[firstRow][firstColumn] = firstNewCell;
      testingMap[secondRow][secondColumn] = secondNewCell;
      model = new Model(view, randomizer);
      model.newGame();
    });

    it('should add 4 and 2 cells', () => {
      for (const row of RowValues) {
        for (const column of ColumnValues) {
          expect(view.setCell).toHaveBeenCalledWith(
            row,
            column,
            testingMap[row][column]
          );
        }
      }
    });

    it('should call randomRow, randomColumn and RandomNewCell', () => {
      expect(randomizer.randomRow).toHaveBeenCalledTimes(2);
      expect(randomizer.randomColumn).toHaveBeenCalledTimes(2);
      expect(randomizer.randomNewCell).toHaveBeenCalledTimes(2);
    });
  });
});

describe('Model: shift', () => {
  let view: Viewable;
  let model: Model;
  let randomizer: TestRandom;
  let testingMap: Cell[][];
  let spyViewSetCell: any;

  beforeEach(() => {
    const row1: Row = 1;
    const col1: Column = 1;
    const cell1: Cell = 2;
    const row2: Row = 2;
    const col2: Column = 2;
    const cell2: Cell = 4;
    testingMap = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    testingMap[row1][col1] = cell1;
    testingMap[row2][col2] = cell2;
    view = new TestView();
    spyViewSetCell = spyOn(view, 'setCell');
    randomizer = new TestRandom();
    spyOn(randomizer, 'randomRow').and.returnValues(row1, row2);
    spyOn(randomizer, 'randomColumn').and.returnValues(col1, col2);
    spyOn(randomizer, 'randomNewCell').and.returnValues(cell1, cell2);
    model = new Model(view, randomizer);
    spyViewSetCell.calls.reset();
  });

  it('should shift up cells', () => {
    model.shiftUp();
    expect(spyViewSetCell).toHaveBeenCalledWith(0, 1, 2);
    expect(spyViewSetCell).toHaveBeenCalledWith(1, 1, 0);
    expect(spyViewSetCell).toHaveBeenCalledWith(0, 2, 4);
    expect(spyViewSetCell).toHaveBeenCalledWith(2, 2, 0);
  });
});
