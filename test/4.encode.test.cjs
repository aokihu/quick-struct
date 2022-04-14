const assert = require("assert");
const { qs } = require("../build/index.js");

function randomSize() {
  return Math.floor(Math.random() * 100);
}

describe("Encode testcases", () => {
  it("Uint8 encode", () => {
    const struct = qs`
            struct {
                u8 a;
            }
        `;
    const obj = {
      a: 128,
    };

    const buf = struct.encode(obj);
    const dv = new DataView(buf);

    assert.strictEqual(dv.getUint8(0), 128, "Member 'a' is equal 128");
  });

  // BigUint64
  it("BigUint64 encode, number with BigInt64 type", () => {
    const struct = qs`
      struct {
        u64 a;
      }
    `;

    const a = BigInt(12333333333);
    const obj = {
      a,
    };

    const buf = struct.encode(obj);
    const dv = new DataView(buf);

    assert.strictEqual(dv.getBigUint64(0, true), a, `Member 'a' is ${a}`);
  });

  // BigUint64
  it("BigUint64 encode, number with Number type", () => {
    const struct = qs`
      struct {
        u64 a;
      }
    `;

    const a = Number.MAX_SAFE_INTEGER - 1;
    const obj = {
      a,
    };

    const buf = struct.encode(obj);
    const dv = new DataView(buf);

    assert.strictEqual(dv.getBigUint64(0, true), BigInt(a), `Member 'a' is ${a}`);
    assert.equal(dv.getBigUint64(0, true), a, `Member 'a' is ${a}`);
  });

  it("Uint8 array with fixed length", () => {
    const struct = qs`
            struct {
                u8 a[5]
            }
        `;

    const obj = {
      a: [0, 1, 2, 3, 4],
    };

    const buf = struct.encode(obj);
    const dv = new DataView(buf);

    obj.a.forEach((val, i) => {
      assert.strictEqual(dv.getUint8(i), val, `Array[${i}] is not equal ${val}`);
    });
  });

  it("Uint16 array with fixed length", () => {
    const struct = qs`
            struct {
                u16 a[5]
            }
        `;

    const obj = {
      a: [0, 1, 2, 3, 4],
    };

    const buf = struct.encode(obj);
    const dv = new DataView(buf);

    obj.a.forEach((val, i) => {
      assert.strictEqual(dv.getUint16(i * 2, true), val, `Array[${i}] is not equal ${val}`);
    });
  });

  it("Uint32 array with fixed length", () => {
    const struct = qs`
            struct {
                u32 a[5]
            }
        `;

    const obj = {
      a: [0, 1, 2, 3, 4],
    };

    const buf = struct.encode(obj);
    const dv = new DataView(buf);

    obj.a.forEach((val, i) => {
      assert.strictEqual(dv.getUint32(i * 4, true), val, `Array[${i}] is not equal ${val}`);
    });
  });

  it("Uint8 array with variable length", () => {
    const struct = qs`
            struct {
                u8 size;
                u8 data[$size];
            }
        `;

    const size = randomSize();
    const testArray = [...new Array(size).keys()];
    const obj = {
      data: testArray,
    };
    const buf = struct.encode(obj);
    const dv = new DataView(buf);

    assert.strictEqual(buf.byteLength, size + 1, `Buffer byte length is not ${1 + size}`);
    assert.strictEqual(dv.getUint8(0), size, `Array length is not equal ${size}`);
    testArray.forEach((v, i) => {
      assert.strictEqual(dv.getUint8(1 + i), v, `Array[${i}] is not equal ${v}`);
    });
  });

  it("String with fixed length", () => {
    const struct = qs`
            struct {
                uchar msg[5];
            }
        `;

    const msg = "hello";
    const buf = struct.encode({ msg });
    const codes = new TextEncoder().encode(msg).buffer;
    assert.deepEqual(buf, codes, `'msg' is not "hello"`);
  });

  it("Complex struct encode", () => {
    const struct = qs`
        <autoflush>
        struct {
            u8 head;
            u32 groupToken;
            u32 deviceToken;
            u16 inPort;
            u16 outPort;
            u8 addressType;
            u8 addressLength;
            uchar address[$addressLength];
        }
      `;

    const msg = {
      head: 209,
      groupToken: 0,
      deviceToken: 1,
      inPort: 8801,
      outPort: 8800,
      addressType: 0,
      addressLength: 9,
      address: "234.0.0.1",
    };

    const buf = struct.encode(msg);
    const dv = new DataView(buf, 0);
    assert.strictEqual(dv.getUint8(0), 209, "Byte[0] is 209");
    assert.strictEqual(dv.getUint32(1, true), 0, "Byte[1-2] is 0");
    assert.strictEqual(dv.getUint32(5, true), 1, "Byte[5-8] is 1");
    assert.strictEqual(dv.getUint16(9, true), 8801, "Byte[9-10] is 8801");
    assert.strictEqual(dv.getUint16(11, true), 8800, "Byte[11-12] is 8800");
    assert.strictEqual(dv.getUint8(13), 0, "Byte[13] is 0");
    assert.strictEqual(dv.getUint8(14), 9, "Byte[14] is 9");
  });

  it("Complex struct encode, endian-big", () => {
    const struct = qs`
        <autoflush>
        struct {
            u8 head;
            u32 groupToken;
            u32 deviceToken;
            u16 inPort;
            u16 outPort;
            u8 addressType;
            u8 addressLength;
            uchar address[$addressLength];
        }
      `;

    const msg = {
      head: 209,
      groupToken: 0,
      deviceToken: 1,
      inPort: 8801,
      outPort: 8800,
      addressType: 0,
      addressLength: 9,
      address: "234.0.0.1",
    };

    const buf = struct.setBigEndian().encode(msg);
    const dv = new DataView(buf, 0);
    assert.strictEqual(dv.getUint8(0), 209, "Byte[0] is 209");
    assert.strictEqual(dv.getUint32(1), 0, "Byte[1-2] is 0");
    assert.strictEqual(dv.getUint32(5), 1, "Byte[5-8] is 1");
    assert.strictEqual(dv.getUint16(9), 8801, "Byte[9-10] is 8801");
    assert.strictEqual(dv.getUint16(11), 8800, "Byte[11-12] is 8800");
    assert.strictEqual(dv.getUint8(13), 0, "Byte[13] is 0");
    assert.strictEqual(dv.getUint8(14), 9, "Byte[14] is 9");
  });

  it("Complex struct encode, endian-big using struct attribute", () => {
    const struct = qs`
        <autoflush>
        <endian:big>
        struct {
            u8 head;
            u32 groupToken;
            u32 deviceToken;
            u16 inPort;
            u16 outPort;
            u8 addressType;
            u8 addressLength;
            uchar address[$addressLength];
        }
      `;

    const msg = {
      head: 209,
      groupToken: 0,
      deviceToken: 1,
      inPort: 8801,
      outPort: 8800,
      addressType: 0,
      addressLength: 9,
      address: "234.0.0.1",
    };

    const buf = struct.encode(msg);
    const dv = new DataView(buf, 0);
    assert.strictEqual(dv.getUint8(0), 209, "Byte[0] is 209");
    assert.strictEqual(dv.getUint32(1), 0, "Byte[1-2] is 0");
    assert.strictEqual(dv.getUint32(5), 1, "Byte[5-8] is 1");
    assert.strictEqual(dv.getUint16(9), 8801, "Byte[9-10] is 8801");
    assert.strictEqual(dv.getUint16(11), 8800, "Byte[11-12] is 8800");
    assert.strictEqual(dv.getUint8(13), 0, "Byte[13] is 0");
    assert.strictEqual(dv.getUint8(14), 9, "Byte[14] is 9");
  });

  it("Complex struct encode, have BigInt64 type", () => {
    const struct = qs`
      <autoflush>
      <endian:little>
      struct {
        u8 head;
        u32 groupToken;
        u32 deviceToken;
        u64 timestamp;
        u64 responseId;
        u16 action;
        u8 payloadType;
        u32 payloadFlags;
      }
    `;

    const field = {
      head: 0xc2,
      groupToken: 0,
      deviceToken: 0,
      timestamp: Date.now(),
      responseId: 1,
      action: 0,
      payloadType: 0,
      payloadFlags: 0,
    };

    const buf = struct.encode(field);
  });
});
