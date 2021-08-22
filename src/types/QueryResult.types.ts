import { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';

export type PossibleQueryResults =
  | RowDataPacket[]
  | RowDataPacket[][]
  | ResultSetHeader
  | OkPacket[];
