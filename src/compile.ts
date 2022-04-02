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

/**
 * find struct block string
 * @param descriptor struct description string
 * @param fromIndex position start search, default is 0
 * @returns [structName, blockString]
 */
export const findStructBlocks = (descriptor: string, fromIndex: number = 0) => {
    const regexp = /\bstruct(?<name>\w*)\{(?<body>\S*?)\}/g
    const desc = descriptor.trim().replace(/\s/g, '')
    const structs: any[] = [];
    
    let result;
    while((result = regexp.exec(desc)) !== null) {
        let [_, _name, _body] = result
        _name = _name === '' ? 'default' : _name
        structs.push([_name, _body])
    }
    return structs;
}


export const parseBody = (body: string) => {
    const regexp = /^(?<type>[u8|i8|u16|i16|u32|i32|u64|i64|char|uchar|string])(?<name>\w+);??/g

}

/**
 * @exports compile()
 * @param structDescriptor C like struct description string
 */
export default (descriptor: string) => {
    const blocks = findStructBlocks(descriptor);
    const structs = [];

    if(Array.isArray(blocks)) {}
    else {}
}