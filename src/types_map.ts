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
    [idx: string]: number
}
export const TYPE_TO_CODE: ITYPE_TO_CODE = {
    'u8': 10,
    'i8': 11,
    'u16': 12,
    'i16': 13,
    'u32': 14,
    'i32': 15,
    'u64': 16,
    'i64': 17,
    'float': 18,
    'double': 19,
    'char': 20,
    'uchar': 21,
    'string': 22
}

export interface ICODE_TO_TYPE {
    [idx: number]: string
}

export const CODE_TO_TYPE: ICODE_TO_TYPE = {
    10: 'u8',
    11: 'i8',
    12: 'u16',
    13: 'i16',
    14: 'u32',
    15: 'i32',
    16: 'u64',
    17: 'i64',
    18: 'float',
    19: 'double',
    20: 'char',
    21: 'uchar',
    22: 'string'
}

export interface ICODE_TO_TYPEVIEW {
    [idx: number]: Uint8ArrayConstructor | Int8ArrayConstructor
    | Uint16ArrayConstructor | Int16ArrayConstructor
    | Uint32ArrayConstructor | Int32ArrayConstructor
    | BigUint64ArrayConstructor | BigInt64ArrayConstructor
    | Float32ArrayConstructor | Float64ArrayConstructor
}

export const CODE_TO_TYPEVIEW: ICODE_TO_TYPEVIEW = {
    10: Uint8Array,
    11: Int8Array,
    12: Uint16Array,
    13: Int16Array,
    14: Uint32Array,
    15: Int32Array,
    16: BigUint64Array,
    17: BigInt64Array,
    18: Float32Array,
    19: Float64Array,
    20: Uint8Array,
    21: Uint8Array,
    22: Uint8Array
}

export interface ICODE_TO_BYTE_SIZE {
    [idx: number]: number
}

export const CODE_TO_BYTE_SIZE: ICODE_TO_BYTE_SIZE = {
    10: 1,
    11: 1,
    12: 2,
    13: 2,
    14: 4,
    15: 4,
    16: 6,
    17: 6,
    18: 4,
    19: 8,
    20: 1,
    21: 1,
    22: 1
}