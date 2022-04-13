/**
 * JS-CStruct library
 *
 * FILE index.ts
 * Version 0.4.1
 * Author aokihu <aokihu@gmail.com>
 * License MIT
 * Copyright (c) 2022 aokihu
 */
import type { StructBlocks } from "./compile";
import { compile, parseStructAttribute } from "./compile";
import { decode } from "./decode";
import { convertToBuffer } from "./encode";
import { CODE_TO_BYTE_SIZE, CODE_TO_DV_TYPE } from "./types_map";

export class QStruct {
  /* ---------------------------------- */
  /*             Properties             */
  /* ---------------------------------- */

  protected _rawString: string = ""; // struct descripted string
  protected _fieldNames: string[] = []; // array to store key name
  protected _decodeFieldDataset: any[] = []; // decoded binary data
  protected _structs: StructBlocks = []; // array to store binary parsed data
  protected _littleEndian: boolean = true;
  protected _decodeLittleEndian: boolean = true;
  protected _autoFlush: boolean = false;

  /* ---------------------------------- */
  /*             Constructor            */
  /* ---------------------------------- */

  constructor(rawString?: string) {
    if (rawString !== undefined) {
      // Store and compile struct layout string
      this._rawString = rawString;
      this._structs = compile(rawString);

      /* ---------------------------------- */
      /*           Set field names          */
      /* ---------------------------------- */
      this._fieldNames = this.findStruct()![1]; // 'default' struct

      /* ---------------------------------- */
      /*          Struct Attributes         */
      /* ---------------------------------- */
      const attrs = parseStructAttribute(this._rawString);

      // Set auto flush property
      this._autoFlush = attrs.autoflush ?? false;

      // Set endianness property
      if (attrs.endian) {
        this._decodeLittleEndian = attrs.endian !== "big";
      }
    }

    // Check endianness
    const testByte = new Uint8Array(new Uint16Array([1]).buffer);
    this._littleEndian = testByte[0] === 1;
  }

  /* ---------------------------------- */
  /*           Private methods          */
  /* ---------------------------------- */

  findStruct(name: string = "default") {
    return this._structs.find((s) => s[0] === name);
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

  get description(): string {
    return JSON.stringify(this._structs);
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
  decode!: (buffer: ArrayBuffer, structName?: string) => any;

  /**
   * Encode object to binary
   * @param obj target object
   * @param structName struct name
   */
  encode(obj: any, structName?: string) {
    // Little endianness
    const isLittleEndian = this._decodeLittleEndian;

    // get struct
    const _struct = arguments.length === 1 ? this._structs[0] : this.findStruct(structName);
    const [_, _fNames, _fDetails] = _struct!;

    // Object key names
    const _keys = Object.keys(obj);

    /* Loop */
    const tmp: any = {};
    let totalByteLength = 0;

    for (let _k of _keys) {
      const _v = obj[_k];
      let _fIdx = _fNames.findIndex((n) => n === _k);
      let _fDetail = _fDetails[_fIdx];
      const _result = Object.freeze(convertToBuffer(_k, _v, _fDetail, isLittleEndian));

      // console.log(_result);
      // store buffer to temp array
      tmp[_k] = _result.buffer;

      // add new buffer length to total buffer length
      totalByteLength += _result.buffer.byteLength;

      /* Put byte length to placeholder field */
      let _i;
      if ((_i = _result.placeholderIndex) !== undefined) {
        let _name = _fNames[_i];
        _fDetail = _fDetails[_i];
        const _resultPlaceholder = Object.freeze(convertToBuffer(_name, _result.buffer.byteLength, _fDetail));

        tmp[_name] = _resultPlaceholder.buffer;
        totalByteLength += _resultPlaceholder.buffer.byteLength;
      }
    }

    /* new buffer to output */
    const output = new Uint8Array(totalByteLength);

    let offset = 0;
    for (let _k of _fNames) {
      const _buf = tmp[_k];
      output.set(new Uint8Array(_buf), offset);
      offset += _buf.byteLength;
    }

    /* Return array buffer result */
    return output.buffer;
  }

  /* ---------------------------------- */
  /*             Flush cache            */
  /* ---------------------------------- */

  /**
   * Flush decoded cache
   */
  flush() {
    this._decodeFieldDataset = [];
    return this;
  }

  /**
   * Auto flush decode cache
   * @param on Switch ON or OFF auto flush
   */
  autoFlush(on?: boolean) {
    this._autoFlush = on === undefined ? true : on;

    return this;
  }

  /* ---------------------------------- */
  /*               Output               */
  /* ---------------------------------- */

  /**
   * Ouput decode data with json
   * @returns Decode binary data
   */
  toJson = () => {
    const result = Object.freeze(
      this._fieldNames.reduce((T, name, idx) => {
        return { ...T, [name]: this._decodeFieldDataset[idx] };
      }, {})
    );

    // auto flush decoded cache
    if (this._autoFlush) {
      this.flush();
    }
    return result;
  };

  /**
   * a.k.a toJson()
   * @returns Decode binary result
   */
  toJSON = () => this.toJson();

  /**
   * Export struct layout data to base64
   */
  exportStructs = () => btoa(JSON.stringify(this._structs));

  /**
   * Import struct layout data
   * @param data Struct layout data which stored in base64
   */
  importStructs = (data: string) => {
    this._structs = JSON.parse(atob(data));
    this._fieldNames = this.findStruct()![1];
  };
}

Object.defineProperties(QStruct.prototype, {
  decode: { value: decode },
});

/**
 *
 * Template string function
 * reuten instance of JSCtruct
 *
 */
export function qs(sds: TemplateStringsArray) {
  return new QStruct(sds.raw[0]);
}
