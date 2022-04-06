/**
 * JS-CStruct library
 *
 * @file types.ts
 * @version 0.0.1
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
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
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

export interface ICODE_TO_TYPEVIEW {
  [idx: number]:
    | number
    | Uint8ArrayConstructor
    | Int8ArrayConstructor
    | Uint16ArrayConstructor
    | Int16ArrayConstructor
    | Uint32ArrayConstructor
    | Int32ArrayConstructor
    | BigUint64ArrayConstructor
    | BigInt64ArrayConstructor
    | Float32ArrayConstructor
    | Float64ArrayConstructor;
}

export const CODE_TO_TYPEVIEW: ICODE_TO_TYPEVIEW = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  Uint8Array,
  Int8Array,
  Uint16Array,
  Int16Array,
  Uint32Array,
  Int32Array,
  BigUint64Array,
  BigInt64Array,
  Float32Array,
  Float64Array,
  Uint8Array,
  Uint8Array,
  Uint8Array,
];

export interface ICODE_TO_BYTE_SIZE {
  [idx: number]: number;
}

export const CODE_TO_BYTE_SIZE: ICODE_TO_BYTE_SIZE = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 4, 4, 6, 6, 4, 8, 1, 1, 1,
];
