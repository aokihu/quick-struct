/**
 * JS-CStruct library
 * 
 * FILE index.ts
 * Version 0.0.1
 * Author aokihu <aokihu@gmail.com>
 * License MIT
 * Copyright (c) 2022 aokihu
 */
import type { StructBlocks } from './compile'; './compile'
import { compile } from './compile'
import { CODE_TO_BYTE_SIZE, CODE_TO_TYPEVIEW } from './types_map';

export class JSCStruct {
    /* ---------------------------------- */
    /*             Properties             */
    /* ---------------------------------- */

    private _rawString: string = '';         // struct descripted string
    private _fieldNames: string[] = [];      // array to store key name
    private _decodeFiledDataset: any[] = []; // decoed binary data
    private _structs: StructBlocks = [];     // array to store binary parsed data

    /* ---------------------------------- */
    /*             Constructor            */
    /* ---------------------------------- */

    constructor(rawString: string) {
        this._rawString = rawString;
        this._structs = compile(rawString)

        const defaultStruct = this.findStruct()
        const [_, fields] = defaultStruct!;
        this._fieldNames = fields.map(field => field[0])
    }


    /* ---------------------------------- */
    /*           Private methods          */
    /* ---------------------------------- */

    findStruct(name: string = 'default') {
        return this._structs.find(s => s[0] === name)
    }

    /* ---------------------------------- */
    /*           Public methods           */
    /* ---------------------------------- */

    decode(buffer: ArrayBuffer, structName: string = 'default') {
        const struct = this.findStruct(structName);
        const [name, fields] = struct!

        let pos = 0;
        let offset = 0;
        let idx = 0;
        let byteSize = 0;
        let buf: ArrayBuffer;
        let unpackValue: any

        for (; idx < fields.length; idx += 1) {
            const field = fields[idx]
            const _typeCode = field[1]
            const _len = field[2]
            const _isArray = field[3]

            byteSize = CODE_TO_BYTE_SIZE[_typeCode]

            offset = _isArray ? pos + byteSize + _len - 1 : pos + byteSize;
            buf = buffer.slice(pos, offset);
            pos = offset;

            const _unpack = new CODE_TO_TYPEVIEW[_typeCode](buf)

            if (_isArray === 0) {
                unpackValue = _unpack[0]
            }

            if (_isArray === 1) {
                unpackValue = Array.prototype.slice.call(_unpack)

                // stirng
                if (_typeCode === 20 || _typeCode === 21 || _typeCode === 22) {
                    unpackValue = String.fromCharCode(...unpackValue)
                }
            }

            this._decodeFiledDataset[idx] = unpackValue;
        }

        return this;
    }

    toJson() {
        return this._fieldNames.reduce((T, fieldName, idx) => {
            return { ...T, [fieldName]: this._decodeFiledDataset[idx] }
        }, {})
    }

}