import { QStruct } from ".";
import type { FieldRecord } from "./compile";
import { CODE_TO_BYTE_SIZE, CODE_TO_DV_TYPE } from "./types_map";

export interface ConvertToBufferResult {
  buffer: ArrayBuffer; // Buffer data
  placeholderIndex?: number; // The index of field, which contain variable length
}

/**
 *
 * @param this QStruct protptype instance
 * @param obj Encoded object target
 * @param structName Struct name, default is 'default'
 */
export function encode(this: QStruct, obj: any, structName?: string): ArrayBufferLike {
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

/**
 * Convert object value to buffer
 * @param name Field name
 * @param value Field value
 * @param fieldDetail Field detail
 */
export const convertToBuffer = (
  name: string,
  value: any,
  fieldDetail: FieldRecord,
  isLittleEndianness: boolean = false
): ConvertToBufferResult => {
  /* Field detail */
  const _fTypeCode = fieldDetail[0];
  const _fAttribute = fieldDetail[1];
  const _fieldIndexOrLength = fieldDetail[2];

  /* Check the field length is variable */
  const _isVar: boolean = (_fAttribute & 0x4) !== 0;

  /* Get the field byte size */
  const _typeSize = CODE_TO_BYTE_SIZE[_fTypeCode];

  /* Dataview method */
  const _gm: string = `set${CODE_TO_DV_TYPE[_fTypeCode]}`;

  /* Result */
  const result: any = {};

  /* If field is variable length,  append index of the size placeholder field */
  _isVar && (result.placeholderIndex = _fieldIndexOrLength);

  /* Convert value to buffer */

  /**
   * -----------------------------------------------------
   *                      BigInt64
   * -----------------------------------------------------
   */
  if (_fTypeCode === 16 || _fAttribute === 17) {
    // Array
    if (typeof value === "object" && Array.isArray(value)) {
      const _bufferLength = _typeSize * value.length;
      const buffer = new ArrayBuffer(_bufferLength);
      const dv = new DataView(buffer);
      const length = value.length;
      for (let i = 0; i < length; i += 1) {
        // @ts-ignore
        dv[_gm](i * _typeSize, BigInt(value[i]), isLittleEndianness);
      }
      result.buffer = buffer;
      return result;
    }
    // Only one digital
    else {
      const _bufferLength = _typeSize;
      const buffer = new ArrayBuffer(_bufferLength);
      const dv = new DataView(buffer);
      const _value = typeof value === "bigint" ? value : typeof value === "number" ? BigInt(value) : undefined;

      // @ts-ignore
      dv[_gm](0, _value, isLittleEndianness);
      result.buffer = buffer;
      return result;
    }
  }

  /**
   * -----------------------------------------------------
   *                  NOT BigInt64
   * -----------------------------------------------------
   */

  // Digital array
  if (typeof value === "object" && Array.isArray(value)) {
    const _bufferLength = _typeSize * value.length;
    const buffer = new ArrayBuffer(_bufferLength);
    const dv = new DataView(buffer);
    const length = value.length;
    for (let i = 0; i < length; i += 1) {
      // @ts-ignore
      dv[_gm](i * _typeSize, value[i], isLittleEndianness);
    }
    result.buffer = buffer;
    return result;
  }

  // String
  if (typeof value === "string") {
    result.buffer = new TextEncoder().encode(value);
    return result;
  }

  // Only one digital
  if (typeof value === "number") {
    const _bufferLength = _typeSize;
    const buffer = new ArrayBuffer(_bufferLength);
    const dv = new DataView(buffer);

    // @ts-ignore
    dv[_gm](0, value, isLittleEndianness);
    result.buffer = buffer;
    return result;
  }

  return result;
};
