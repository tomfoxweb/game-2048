import { Column, NewCell, Row } from './cell';

export interface Randomable {
  randomRow(): Row;
  randomColumn(): Column;
  randomNewCell(): NewCell;
}
