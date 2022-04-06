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
import {
  CODE_TO_BYTE_SIZE,
  CODE_TO_DV_TYPE,
  CODE_TO_TYPEVIEW,
} from "./types_map";

export class JSCStruct {
  /* ---------------------------------- */
  /*             Properties             */
  /* ---------------------------------- */

  private _rawString: string = ""; // struct descripted string
  private _fieldNames: string[] = []; // array to store key name
  private _decodeFieldDataset: any[] = []; // decoed binary data
  private _structs: StructBlocks = []; // array to store binary parsed data
  private _littleEndian: boolean = true;
  private _decodeLittleEndian: boolean = true;

  /* ---------------------------------- */
  /*             Constructor            */
  /* ---------------------------------- */

  constructor(rawString: string) {
    this._rawString = rawString;
    this._structs = compile(rawString);
    const defaultStruct = this.findStruct();
    const [_, fields] = defaultStruct!;
    this._fieldNames = fields[0];

    // Check endianness
    const testByte = new Uint8Array(new Uint16Array([1]).buffer);
    this._littleEndian = testByte[0] === 1;
  }

  /* ---------------------------------- */
  /*           Private methods          */
  /* ---------------------------------- */

  findStruct(name?: string) {
    return arguments.length === 0
      ? this._structs[0]
      : this._structs.find((s) => s[0] === name);
  }

  /* ---------------------------------- */
  /*        Public Get Properties       */
  /* ---------------------------------- */

  get isLittleEndian(): boolean {
    return this._littleEndian;
  }

  get isBigEndian(): boolean {
    return !this._littleEndian;
  }

  get endianness(): string {
    return this._littleEndian ? "little" : "big";
  }

  /* ---------------------------------- */
  /*           Public methods           */
  /* ---------------------------------- */

  /**
   * Set big endian when decode binary
   */
  setBigEndian() {
    this._decodeLittleEndian = false;
  }

  /**
   * Set little endian when decode binary
   */
  setLittleEndian() {
    this._decodeLittleEndian = true;
  }

  /**
   * Decode binary to javascript data
   * @param buffer binary data
   * @param structName struct name
   * @returns class instance self
   */
  decode(buffer: ArrayBuffer, structName?: string) {
    const struct =
      arguments.length === 1 ? this._structs[0] : this.findStruct(structName);

    const fields = struct![1][1];

    /* local variable */
    let pos = 0;
    let offset = 0;
    let typeSize = 0;
    let decodedValue: any;
    const isLittleEndian = this._littleEndian;

    const tIdx = fields.length;
    for (let idx = 0; idx < tIdx; idx += 1) {
      const field = fields[idx];
      const _typeCode = field[0];
      const _attr = field[1];
      const _lenOrIdx = field[2];
      const _isArr: boolean = (_attr & 0x2) !== 0;
      const _isVar: boolean = (_attr & 0x4) !== 0;

      // Get array length
      const _arrayLength = _isVar
        ? this._decodeFieldDataset[_lenOrIdx]
        : _isArr
          ? _lenOrIdx
          : 1;

      typeSize = CODE_TO_BYTE_SIZE[_typeCode];
      offset = pos + typeSize * _arrayLength;

      const byteLength = typeSize * _arrayLength;
      const dv: DataView = new DataView(buffer, pos, byteLength);
      const gm: string = `get${CODE_TO_DV_TYPE[_typeCode]}`;

      switch (_attr) {
        case 0x0:
          // @ts-ignore
          decodedValue = dv[gm](0, isLittleEndian);
          break;
        case 0x2:
        case 0x6:
          decodedValue = [...Array(_arrayLength).keys()].map((v, i) =>
            // @ts-ignore
            dv[gm](i * typeSize, isLittleEndian)
          );
          break;
        case 0x3:
        case 0x7:
          decodedValue = new TextDecoder().decode(buffer.slice(pos, offset));
          break;
      }

      pos = offset;
      this._decodeFieldDataset.push(decodedValue);
    }

    return this;
  }

  /**
   * Encode object to binary
   * @param obj target object
   * @param structName struct name
   */
  encode(obj: any, structName?: string) {
    // get struct
    const _struct =
      arguments.length === 1 ? this._structs[0] : this.findStruct(structName);
    // for digital
    // for digital array
    // for string
  }

  /* ---------------------------------- */
  /*               Output               */
  /* ---------------------------------- */

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
