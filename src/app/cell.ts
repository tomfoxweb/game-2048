export const RowValues = [0, 1, 2, 3] as const;
export const ColumnValues = [0, 1, 2, 3] as const;
export const CellValues = [
  0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
  65536,
] as const;

export const ROW_COUNT = RowValues.length;

export type Row = typeof RowValues[number];
export type Column = typeof ColumnValues[number];
export type Position = { row: Row; column: Column };
export type Cell = typeof CellValues[number];

export type GameMap = [
  [Cell, Cell, Cell, Cell],
  [Cell, Cell, Cell, Cell],
  [Cell, Cell, Cell, Cell],
  [Cell, Cell, Cell, Cell]
];

export type NewCell = 2 | 4;
