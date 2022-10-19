import { Cell, Column, ColumnValues, Row, RowValues } from './cell';
import { Model } from './model';
import { Randomable } from './randomable';
import { Viewable } from './viewable';

class TestView implements Viewable {
  setCell(row: Row, column: Column, cell: Cell): void {}
}

class TestRandom implements Randomable {
  indexRow = 0;
  indexColumn = 0;
  valuesRow: Row[] = [];
  valuesColumn: Column[] = [];

  randomRow(): Row {
    return this.valuesRow[this.indexRow++];
  }

  randomColumn(): Column {
    return this.valuesColumn[this.indexColumn++];
  }
}

describe('Model: new game', () => {
  let view: Viewable;
  let randomizer: TestRandom;
  let firstRandomRow: Row;
  let firstRandomColumn: Column;
  let secondRandomRow: Row;
  let secondRandomColumn: Column;
  let model: Model;

  beforeEach(() => {
    view = new TestView();
    spyOn(view, 'setCell');
    randomizer = new TestRandom();
  });

  describe('add two 2 cells', () => {
    let testingMap: Cell[][];

    beforeEach(() => {
      testingMap = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      firstRandomRow = 1;
      firstRandomColumn = 2;
      secondRandomRow = 3;
      secondRandomColumn = 0;
      randomizer.valuesRow = [firstRandomRow, secondRandomRow];
      randomizer.valuesColumn = [firstRandomColumn, secondRandomColumn];
      testingMap[firstRandomRow][firstRandomColumn] = 2;
      testingMap[secondRandomRow][secondRandomColumn] = 2;
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
  });
});
