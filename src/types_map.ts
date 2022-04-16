/**
 * JS-CStruct library
 *
 * @file types.ts
 * @version 1.0.1
 * @author aokihu <aokihu@gmail.com>
 * @license MIT
 * @copyright (c) 2022 aokihu
 */

export interface ITYPE_TO_CODE {
  [idx: string]: number;
}
export const TYPE_TO_CODE: ITYPE_TO_CODE = {
  u8: 10,
  i8: 11,
  u16: 12,
  i16: 13,
  u32: 14,
  i32: 15,
  u64: 16,
  i64: 17,
  float: 18,
  double: 19,
  char: 20,
  uchar: 21,
  string: 22,
  struct: 23,
};

export interface ICODE_TO_TYPE {
  [idx: number]: string | number;
}

export const CODE_TO_TYPE: ICODE_TO_TYPE = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "u8",
  "i8",
  "u16",
  "i16",
  "u32",
  "i32",
  "u64",
  "i64",
  "float",
  "double",
  "char",
  "uchar",
  "string",
  "struct",
];

export const CODE_TO_DV_TYPE = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "Uint8",
  "Int8",
  "Uint16",
  "Int16",
  "Uint32",
  "Int32",
  "BigUint64",
  "BigInt64",
  "Float32",
  "Float64",
  "Uint8",
  "Uint8",
  "Uint8",
];

export interface ICODE_TO_BYTE_SIZE {
  [idx: number]: number;
}

export const CODE_TO_BYTE_SIZE: ICODE_TO_BYTE_SIZE = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 4, 4, 8, 8, 4, 8, 1, 1, 1,
];
