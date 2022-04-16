import { QStruct } from ".";
import { CODE_TO_BYTE_SIZE, CODE_TO_DV_TYPE } from "./types_map";

const BIGINT_MIN_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);

/**
 * Decode binary to javascript data
 * @param buffer binary data
 * @param structName struct name
 * @returns class instance self
 */
export function decode(this: QStruct, buffer: ArrayBuffer, structName?: string) {
  // get struct
  const struct = arguments.length === 1 ? this._structs[0] : this.findStruct(structName);

  // get struct fields
  const fields = struct![2];

  /* local variable */
  let pos = 0;
  let offset = 0;
  let typeSize = 0;
  let decodedValue: any;
  const isLittleEndian = this._decodeLittleEndian;
  const isEndianConsistent = this._decodeLittleEndian === this._littleEndian;

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
    const _arrayLength = _isVar ? this._decodeFieldDataset[_lenOrIdx] : _isArr ? _lenOrIdx : 1;

    typeSize = CODE_TO_BYTE_SIZE[_typeCode];
    offset = pos + typeSize * _arrayLength;

    const dv: DataView = new DataView(buffer);
    const gm: string = `get${CODE_TO_DV_TYPE[_typeCode]}`;

    switch (_attr) {
      case 0x0:
        // @ts-ignore
        decodedValue = dv[gm](pos, isLittleEndian);
        break;
      case 0x2:
      case 0x6:
        decodedValue = [...Array(_arrayLength).keys()].map((v, i) =>
          // @ts-ignore
          dv[gm](i * typeSize + pos, isLittleEndian)
        );
        break;
      case 0x3:
      case 0x7:
        decodedValue = new TextDecoder().decode(buffer.slice(pos, offset));
        break;
    }

    pos = offset;

    // Push decoded value into result set
    this._decodeFieldDataset.push(decodedValue);
  }

  return this;
}

/**
 * Convert BitInt number to Number number, it is smaller than MAX_SAFE_INTEGER
 * @param num BigInt number
 */
function convertBigIntToNumber(num: BigInt) {
  return num < BIGINT_MIN_INTEGER ? Number(num) : num;
}
