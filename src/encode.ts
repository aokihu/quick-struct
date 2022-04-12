import type { FieldRecord } from "./compile";
import { CODE_TO_BYTE_SIZE, CODE_TO_DV_TYPE } from "./types_map";

export interface ConvertToBufferResult {
  buffer: ArrayBuffer; // Buffer data
  placeholderIndex?: number; // The index of field, which contain variable length
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

  /* If field is variable length, append index of the size placeholder field */
  if (_isVar) {
    result.placeholderIndex = _fieldIndexOrLength;
  }

  /* Convert value to buffer */

  // Digital array
  if (typeof value === "object" && Array.isArray(value)) {
    const _bufferLength = _typeSize * value.length;
    const buffer = new ArrayBuffer(_bufferLength);
    const dv = new DataView(buffer);
    for (let i = 0; i < value.length; i += 1) {
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
