import { Cell, Column, Row } from './cell';

export interface Viewable {
  setCell(row: Row, column: Column, cell: Cell): void;
  showGameOver(): void;
}
