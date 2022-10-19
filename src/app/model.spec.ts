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
});
