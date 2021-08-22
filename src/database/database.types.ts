import { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';

export type QueryResponse =
  | RowDataPacket[]
  | RowDataPacket[][]
  | ResultSetHeader
  | OkPacket
  | OkPacket[];
