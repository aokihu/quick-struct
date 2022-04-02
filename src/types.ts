/**
 * JS-CStruct library
 * 
 * FILE types.ts
 * Version 0.0.1
 * Author aokihu <aokihu@gmail.com>
 * License MIT
 * Copyright (c) 2022 aokihu
 */

export const TYPE_TO_CODE = {
    'u8':10,
    'i8':11,
    'u16':12,
    'i16':13,
    'u32':14,
    'i32':15,
    'u64':16,
    'i64':17,
    'float':18,
    'double':19,
    'char':20,
    'uchar':21,
    'string':22
}

export const CODE_TO_TYPE = {
    10:'u8',
    11:'i8',
    12:'u16',
    13:'i16',
    14:'u32',
    15:'i32',
    16:'u64',
    17:'i64',
    18:'float',
    19:'double',
    20:'char',
    21:'uchar',
    22:'string'
}

export const CODE_TO_VIEWTYPE = {
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