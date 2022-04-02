/**
 * JS-CStruct library
 * 
 * FILE index.ts
 * Version 0.0.1
 * Author aokihu <aokihu@gmail.com>
 * License MIT
 * Copyright (c) 2022 aokihu
 */

//  const C_TYPES = {
//     'char': [Uint8Array, 1],
//     'uchar': [Uint8Array, 1],
//     'i8': [Int8Array, 1],
//     'u8': [Uint8Array, 1],
//     'i16': [Int16Array, 2],
//     'u16': [Uint16Array, 2],
//     'i32': [Int32Array, 4],
//     'u32': [Uint32Array, 4],
//     'i64': [Int16Array, 8],
//     'u64': [BigUint64Array, 8]
// }

enum C_TYPES {
    
}

const LINE_PARTTEN = /(\S+)\s(\w+)(\[(\d+)\])?/g
const ELEMENT_PARTTEN = /(\S+)\[(\d+)\]/

class JSCStruct {
    
    private _rawString: string = '';  // struct descripted string
    private _keyNames: string[] = []; // array to store key name
    private _dataset: any[] = [];     // array to store binary parsed data

    constructor(rawString: string) {
        this._rawString = rawString;
        this.compile()
    }
    
    /* Private methods */
    
    compile() {

    }

}