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
import type { StructBlocks } from './compile'; './compile'
import {compile} from './compile'

export class JSCStruct {
    /* ---------------------------------- */
    /*             Properties             */
    /* ---------------------------------- */

    private _rawString: string = '';        // struct descripted string
    private _keyNames: string[] = [];       // array to store key name
    private _blocks: StructBlocks = [];     // array to store binary parsed data

    /* ---------------------------------- */
    /*             Constructor            */
    /* ---------------------------------- */

    constructor(rawString: string) {
        this._rawString = rawString;
        this._blocks = compile(rawString)
    }
    

    /* ---------------------------------- */
    /*           Private methods          */
    /* ---------------------------------- */

    findStruckBlock(name: string = 'default') {
        return this._blocks.find(b => b[0] === name)
    }

    /* ---------------------------------- */
    /*           Public methods           */
    /* ---------------------------------- */

    decode(buffer: ArrayBuffer, structName: string = 'default' ) {
        const struct = this.findStruckBlock(structName);
        const [name, fields] = struct!

        let pos = 0;
        let offset = 0;
        let idx = 0;
        let buf:ArrayBuffer;

        for(; idx < fields.length; idx += 1) {
            const field = fields[idx]
            const _type = field[0]
            const _name = field[1]
            const _len = field[2]
            
            offset = pos + _len;
            buf = buffer.slice(pos, offset);
            pos += offset;
        }

        console.log( name, fields)
    }



}