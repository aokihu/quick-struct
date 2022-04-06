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

export type StructBlocks = Array<[string, [string[], FieldRecordArray]]>

export interface StructBlockRecord {
    [0]: string     // struct name
    [1]: string     // struct definition field string
}

export type StructBlockRecordArray = Array<StructBlockRecord>

export interface FieldRecord {
    [0]: number     // Field type code
    [1]: number     // Bytes length, default is 0, variable length it will be -1
    [2]: number     // Attribute
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
    const regexp = /\bstruct(\w*)\{(\S*?)\}/g
    const desc = descriptor.trim().replace(/\s/g, '')
    const structs: StructBlockRecordArray = [];

    let result;
    while ((result = regexp.exec(desc)) !== null) {
        let [_name, _body] = result.slice(1)
        _name = _name === '' ? 'default' : _name
        structs.push([_name, _body])
    }
    return structs;
}

/**
 * 
 * @param typeCode 
 * @param length 
 * @param expand 
 * @returns attribute number
 * 
 * Attribute
 * 
 * +---+---+---+---+---+---+---+---+
 * | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 |
 * +---+---+---+---+---+---+---+---+
 *                               ^
 *                               |
 *                 FIRST BIT ----+
 * ---------------------------------
 * 1: [0] digital   [1] string
 * 2: [0] not array [1] array
 * 3: [0] fixed     [1] variable
 * 
 * P.S. 
 * String and digital array are array, bit 2 is '1'
 */
export const parseAttribute = (
    typeCode: number,
    length: undefined | string,
    expand?: string
) => {
    if (length === undefined && typeCode < 20) { return 0x0 }

    if (length !== undefined) {
        if (length !== '') {
            if (typeCode < 20) { return 0x2 }
            if (typeCode >= 20 && typeCode <= 22) { return 0x3 }
        } else {
            if (typeCode < 20) { return 0x6 }
            if (typeCode >= 20 && typeCode <= 22) { return 0x7 }
        }
    }

    return 0;
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
 *          [fieldNames: string,...],
 *          [
 *              type_code: number,
 *              attribute: number,
 *              byte_length: number,
 *          ],
 *          ...
 *      ]
 *   ],
 *  ...
 * ]
 */
export const parseBody = (body: string) => {
    const regexp = /(u8|i8|u16|i16|u32|i32|u64|i64|f32|f64|char|uchar|string)(\w+)(?:\[(\d*)\])?;??/g

    const fieldNames: string[] = []
    const fieldDetails: FieldRecordArray = []
    let result;

    while ((result = regexp.exec(body)) !== null) {
        let [_type, _name, _length] = result.slice(1)

        const _typeCode: number = TYPE_TO_CODE[_type]
        let _len = _length ? Number(_length) : 0
        const _attribute = parseAttribute(_typeCode, _length);
        fieldNames.push(_name)
        fieldDetails.push([_typeCode, _attribute, _len,])
    }
    return [fieldNames, fieldDetails];
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
        const [_names, _details] = parseBody(_body)
        return [_structName, [_names, _details]]
    }) as StructBlocks
}