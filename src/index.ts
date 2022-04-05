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

    sliceBuffer(
        buf: ArrayBuffer,
        typeCode: number,
        startIdx: number,
        length: number,
        isArray: boolean) {

        const sizeByte = CODE_TO_BYTE_SIZE[typeCode]
        const offset = isArray ?
            startIdx + sizeByte + length - 1 :
            startIdx + sizeByte;

        return [offset, buf.slice(startIdx, offset)]
    }

    /* ---------------------------------- */
    /*           Public methods           */
    /* ---------------------------------- */

    decode(buffer: ArrayBuffer, structName: string = 'default') {
        const struct = this.findStruct(structName);
        const [name, fields] = struct!

        /* local variable */
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
            const _attr = field[3]
            const _isArray: boolean = (_attr & 0x2) !== 0;
            const _isVariable: boolean = (_attr & 0x4) !== 0;

            if (_isVariable) {

                // get last element value, used to size of variable array
                const _varLen = this._decodeFiledDataset[idx - 1];

                byteSize = CODE_TO_BYTE_SIZE[_typeCode]
                offset = pos + byteSize + _varLen - 1;
                buf = buffer.slice(pos, offset);
                pos = offset

                // Contruct a new typedview
                const _unpack = new CODE_TO_TYPEVIEW[_typeCode](buf)

                switch (_attr) {
                    case 0x6:
                        unpackValue = [..._unpack]
                        break
                    case 0x7:
                        unpackValue = (new TextDecoder()).decode(buf)
                        break;
                }

                this._decodeFiledDataset[idx] = unpackValue
            }
            else {

                byteSize = CODE_TO_BYTE_SIZE[_typeCode]

                offset = _isArray ? pos + byteSize + _len - 1 : pos + byteSize;
                buf = buffer.slice(pos, offset);
                pos = offset;

                // Contruct a new typedview
                const _unpack = new CODE_TO_TYPEVIEW[_typeCode](buf)

                switch (_attr) {

                    case 0x0:
                        unpackValue = _unpack[0]
                        break;
                    case 0x2:
                        unpackValue = [..._unpack]
                        break;
                    case 0x3:
                        unpackValue = (new TextDecoder()).decode(buf)
                        break;
                    case 0x6:
                        break;
                }

                this._decodeFiledDataset[idx] = unpackValue;
            }
        }


        return this;
    }

    /**
     * Ouput decode data with json
     * @returns Decode binary data
     */
    toJson = () => (this._fieldNames.reduce((T, name, idx) => {
        return { ...T, [name]: this._decodeFiledDataset[idx] }
    }, {})
    )

    /**
     * a.k.a toJson()
     * @returns Decode binary result
     */
    toJSON = () => this.toJson()

}

/**
 *
 * Template string function
 * reuten instance of JSCtruct
 *
 */
export function qs(sds: TemplateStringsArray) {
    return new JSCStruct(sds.raw[0]);
}