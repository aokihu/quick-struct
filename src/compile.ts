/**
 * JS-CStruct library
 * 
 * FILE compile.ts
 * Version 0.0.1
 * Author aokihu <aokihu@gmail.com>
 * License MIT
 * Copyright (c) 2022 aokihu
 * 
 * Description
 * ------------------------------------------------------------
 * compile() method will parse struct descriptor string
 * and return an object which like 
 * 
 * {
 *  'structName': {
 *      length: Number,
 *      desc: 
 *      [
 *          [...keys], 
 *          [...info]
 *      ],
 *      
 *  },
 *  ...
 * }
 * 
 * If there is only one struct, 'default' is the struct name.
 * 
 * Member 'length' record the total length of bytes,
 * 
 * Member 'desc' contains the struct inforamtions,
 * first array is the key names,
 * and second array is the detail of struct infomation,
 * it like [type, length, <structMapNumber>]
 * 
 * ------------------------------------------------------------
 */

import { TYPE_TO_CODE } from "./types_map"

/* ---------------------------------- */
/*            Type declare            */
/* ---------------------------------- */

export type StructBlocks = Array<[string, FieldRecordArray]>

export interface StructBlockRecord {
    [0]: string     // struct name
    [1]: string     // struct definition field string
}

export type StructBlockRecordArray = Array<StructBlockRecord>

export interface FieldRecord {
    [0]: string     // Field data type
    [1]: number     // Field name
    [2]: number     // Bytes length, default is 0, variable length it will be -1
    [3]: number     // Array flag, 0 is not array, 1 is array
}

export type FieldRecordArray = Array<FieldRecord>

/* ---------------------------------- */
/*               Methods              */
/* ---------------------------------- */

/**
 * find struct block string
 * @param descriptor struct description string
 * @param fromIndex position start search, default is 0
 * @returns [structName, blockString]
 */
export const findStructBlocks = (descriptor: string, fromIndex: number = 0) => {
    const regexp = /\bstruct(?<name>\w*)\{(?<body>\S*?)\}/g
    const desc = descriptor.trim().replace(/\s/g, '')
    const structs: StructBlockRecordArray = [];

    let result;
    while ((result = regexp.exec(desc)) !== null) {
        let [_, _name, _body] = result
        _name = _name === '' ? 'default' : _name
        structs.push([_name, _body])
    }
    return structs;
}

/**
 * parse struct definition string
 * @param body struct definition string
 * @returns Array
 * @description
 * Return array like:
 * [
 *   [
 *      structName: string, 
 *      [
 *          [field_name: string, type_code: number, byte_length: number],
 *          ...
 *      ]
 *   ],
 *  ...
 * ]
 */
export const parseBody = (body: string) => {
    const regexp = /(?<type>u8|i8|u16|i16|u32|i32|u64|i64|char|uchar|string)(?<name>\w+)(?:\[(\d+)\])?;??/g

    const rows: FieldRecordArray = []
    let result;

    while ((result = regexp.exec(body)) !== null) {
        let [_, _type, _name, _length] = result
        const _typeCode: number = TYPE_TO_CODE[_type]
        const _isArray = _length ? 1 : 0
        let _len = _length ? Number(_length) : 0
        rows.push([_name, _typeCode, _len, _isArray])
    }
    return rows;
}

/**
 * @exports compile()
 * @param structDescriptor C like struct description string
 */
export const compile = (descriptor: string) => {
    const blocks = findStructBlocks(descriptor);
    return blocks.map((b) => {
        const _structName = b[0]
        const _body = b[1]
        const _rows = parseBody(_body)
        return [_structName, _rows]
    }) as StructBlocks
}