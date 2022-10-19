import { Column, Row } from './cell';

export interface Randomable {
  randomRow(): Row;
  randomColumn(): Column;
}
