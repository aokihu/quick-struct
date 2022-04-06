/**
 * JS-CStruct library
 *
 * FILE index.ts
 * Version 0.0.1
 * Author aokihu <aokihu@gmail.com>
 * License MIT
 * Copyright (c) 2022 aokihu
 */
import type { StructBlocks } from "./compile";
import { compile } from "./compile";
import { CODE_TO_BYTE_SIZE, CODE_TO_TYPEVIEW } from "./types_map";

export class JSCStruct {
  /* ---------------------------------- */
  /*             Properties             */
  /* ---------------------------------- */

  private _rawString: string = ""; // struct descripted string
  private _fieldNames: string[] = []; // array to store key name
  private _decodeFieldDataset: any[] = []; // decoed binary data
  private _structs: StructBlocks = []; // array to store binary parsed data

  /* ---------------------------------- */
  /*             Constructor            */
  /* ---------------------------------- */

  constructor(rawString: string) {
    this._rawString = rawString;
    this._structs = compile(rawString);

    const defaultStruct = this.findStruct();
    const [_, fields] = defaultStruct!;
    this._fieldNames = fields.map((field) => field[0]);
  }

  /* ---------------------------------- */
  /*           Private methods          */
  /* ---------------------------------- */

  findStruct(name: string = "default") {
    return this._structs.find((s) => s[0] === name);
  }

  /* ---------------------------------- */
  /*           Public methods           */
  /* ---------------------------------- */

  decode(buffer: ArrayBuffer, structName: string = "default") {
    const struct =
      arguments.length === 1 ? this._structs[0] : this.findStruct(structName);

    const fields = struct![1];

    /* local variable */
    let pos = 0;
    let offset = 0;
    let idx = 0;
    let typeSize = 0;
    let buf: ArrayBuffer;
    let decodedValue: any;

    const tIdx = fields.length;
    for (; idx < tIdx; idx += 1) {
      const field = fields[idx];
      const _typeCode = field[1];
      const _fixedLength = field[2];
      const _attr = field[3];
      const _isArr: boolean = (_attr & 0x2) !== 0;
      const _isVar: boolean = (_attr & 0x4) !== 0;

      /**
       * ------ optimization ------
       */

      // Get array length
      const _arrayLength = _isVar
        ? this._decodeFieldDataset[idx - 1]
        : _isArr
        ? _fixedLength
        : 1;

      // Get type size
      typeSize = CODE_TO_BYTE_SIZE[_typeCode];

      // Calculate offset
      offset = pos + typeSize * _arrayLength;

      // Slice buffer
      buf = buffer.slice(pos, offset);

      // Move 'pos' to next position
      pos = offset;

      // decode
      const _decode = new CODE_TO_TYPEVIEW[_typeCode](buf);

      switch (_attr) {
        case 0x0:
          decodedValue = _decode[0];
          break;
        case 0x2:
        case 0x6:
          decodedValue = [..._decode];
          break;
        case 0x3:
        case 0x7:
          decodedValue = new TextDecoder().decode(_decode);
          break;
      }

      this._decodeFieldDataset[idx] = decodedValue;
    }

    return this;
  }

  /**
   * Ouput decode data with json
   * @returns Decode binary data
   */
  toJson = () =>
    this._fieldNames.reduce((T, name, idx) => {
      return { ...T, [name]: this._decodeFieldDataset[idx] };
    }, {});

  /**
   * a.k.a toJson()
   * @returns Decode binary result
   */
  toJSON = () => this.toJson();
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
