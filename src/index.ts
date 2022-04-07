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
import { convertToBuffer } from "./encode";
import { CODE_TO_BYTE_SIZE, CODE_TO_DV_TYPE } from "./types_map";

export class QStruct {
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
   * @returns class instance self
   */
  setBigEndian() {
    this._decodeLittleEndian = false;
    return this;
  }

  /**
   * Set little endian when decode binary
   * @returns class instance self
   */
  setLittleEndian() {
    this._decodeLittleEndian = true;
    return this;
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
    const isLittleEndian = this._decodeLittleEndian;

    /* Loop */
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
    const [_, [_fNames, _fDetails]] = _struct!;

    // Object key names
    const _keys = Object.keys(obj);

    /* Loop */
    const tmp: any = {};
    let totalByteLength = 0;
    for (let _k of _keys) {
      const _v = obj[_k];
      let _fIdx = _fNames.findIndex((n) => n === _k);
      let _fDetail = _fDetails[_fIdx];
      const _result = Object.freeze(convertToBuffer(_k, _v, _fDetail));

      tmp[_k] = { buffer: _result.buffer };
      totalByteLength += _result.buffer.byteLength;

      /* Put byte length to placeholder field */
      let idx;
      if ((idx = _result.placeholderIndex) !== undefined) {
        let _name = _fNames[idx];
        _fDetail = _fDetails[idx];
        const _resultPlaceholder = Object.freeze(
          convertToBuffer(_name, _result.buffer.byteLength, _fDetail)
        );

        tmp[_name] = { buffer: _resultPlaceholder.buffer };
        totalByteLength += _resultPlaceholder.buffer.byteLength;
      }
    }

    /* new buffer to output */
    const output = new Uint8Array(totalByteLength);

    let offset = 0;
    for (let _name of _fNames) {
      const { buffer } = tmp[_name];
      const _uintArr = new Uint8Array(buffer);
      output.set(_uintArr, offset);
      offset += buffer.byteLength;
    }

    return output.buffer;
  }

  /* ---------------------------------- */
  /*               Output               */
  /* ---------------------------------- */

  /**
   * Ouput decode data with json
   * @returns Decode binary data
   */
  toJson = () =>
    Object.freeze(
      this._fieldNames.reduce((T, name, idx) => {
        return { ...T, [name]: this._decodeFieldDataset[idx] };
      }, {})
    );

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
  return new QStruct(sds.raw[0]);
}
