/**
 * Decode test
 */

import assert from 'node:assert';
import { qs } from '../build/index.js'

describe("Decode testcases", () => {

  // Uint8
  it('Uint8 decode', () => {
    const struct = qs`
      struct {
        u8 a;
      }
    `;

    const buffer = new Uint8Array([16]).buffer;
    const result = struct.decode(buffer).toJSON();
    assert.strictEqual(result.a, 16, 'a is not 16');
  }
  );

  // Int8
  it('Int8 decode', () => {
    const struct = qs`
      struct {
        i8 a;
      }
    `;

    const buffer = new Int8Array([-16]).buffer;
    const result = struct.decode(buffer).toJSON();
    assert.strictEqual(result.a, -16, 'a is not -16');
  }
  );

  // Uint16
  it('Uint16 decode', () => {
    const struct = qs`
      struct {
        u16 a;
      }
    `;

    const buffer = new Uint16Array([0xFF06]).buffer;
    const result = struct.decode(buffer).toJSON();
    assert.strictEqual(result.a, 0xFF06, 'a is not 0xFF06');
  }
  );

  // Int16
  it('Int16 decode', () => {
    const struct = qs`
      struct {
        i16 a;
      }
    `;

    const buffer = new Uint16Array([0xFF06]).buffer;
    const result = struct.decode(buffer).toJSON();
    assert.strictEqual(result.a, -250, 'a is not -250');
  }
  );

  // UIn16 to Int16
  it('Uint16 to Int16 decode', () => {
    const struct = qs`
      struct {
        i16 a;
      }
    `;

    const buffer = new Uint16Array([0xFF06]).buffer;
    const result = struct.decode(buffer).toJSON();
    assert.strictEqual(result.a, -250, 'a is not -250');
  }
  );

  // Int16 to Uint16
  it('Int16 to Uint16 decode', () => {
    const struct = qs`
      struct {
        u16 a;
      }
    `;

    const buffer = new Int16Array([-250]).buffer;
    const result = struct.decode(buffer).toJSON();
    assert.strictEqual(result.a, 0xFF06, 'a is not 0xFF06');
  }
  );


  // BigUint64
  it('BigUint64 decode', () => {
    const struct = qs`
      struct {
        u64 a;
      }
    `;

    const buffer = new BigUint64Array([12333333333n]).buffer;
    const result = struct.decode(buffer).toJSON();
    assert.strictEqual(result.a, 12333333333n, 'a is not 12333333333n');
  }
  );

  // BigInt64
  it('BigInt64 decode', () => {
    const struct = qs`
      struct {
        i64 a;
      }
    `;

    const buffer = new BigInt64Array([-12333333333n]).buffer;
    const result = struct.decode(buffer).toJSON();
    assert.strictEqual(result.a, -12333333333n, 'a is not -12333333333n');
  }
  );

  // Variable length Uint8Array
  it('Variable length Uint8Array decode', () => {
    const struct = qs`
      struct {
        u8 len;
        u8 data[$len];
      }
    `;

    const buffer = new Uint8Array([3, 1, 2, 3]).buffer;
    const result = struct.decode(buffer).toJSON();
    assert.strictEqual(result.len, 3, 'len is not 3');
    assert.deepStrictEqual(result.data, [1, 2, 3], 'data is not [1, 2, 3]');
  }
  );

  // Variable length Int8Array
  it('Variable length Int8Array decode', () => {
    const struct = qs`
      struct {
        u8 len;
        i8 data[$len];
      }
    `;

    const buffer = new Int8Array([3, -1, -2, -3]).buffer;
    const result = struct.decode(buffer).toJSON();
    assert.strictEqual(result.len, 3, 'len is not 3');
    assert.deepStrictEqual(result.data, [-1, -2, -3], 'data is not [-1, -2, -3]');
  }
  );

})