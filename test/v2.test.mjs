import assert from "assert";
import pkg from "../build/index.js";
const { QStruct } = pkg;

describe("QStruct class test", () => {
  describe("Flush testcases", () => {
    // With flush
    it("Flush cache with flush()", () => {
      const str = `
                struct {
                    u8 a;
                    u16 b;
                }
            `;

      const buf = new Uint8Array([16, 0, 0]).buffer;
      const struct = new QStruct(str);
      assert.strictEqual(struct.decode(buf).toJson().a, 16, 'First "a" is not equal 16');
      struct.flush();

      const buf2 = new Uint8Array([32, 0, 0]).buffer;
      assert.strictEqual(struct.decode(buf2).toJson().a, 32, 'Second "a" is not equal 32');
    });

    // Without flush()
    it("Flush cache without flush()", () => {
      const str = `
                struct {
                    u8 a;
                    u16 b;
                }
            `;

      const buf = new Uint8Array([16, 0, 0]).buffer;
      const struct = new QStruct(str);
      assert.strictEqual(struct.decode(buf).toJson().a, 16, 'First "a" is equal 16');
      const buf2 = new Uint8Array([32, 0, 0]).buffer;
      assert.notStrictEqual(struct.decode(buf2).toJson().a, 32, 'Second "a" is not equal 32');
      assert.strictEqual(struct.decode(buf2).toJson().a, 16, 'Second "a" is equal 16');
    });

    // With autoFlush()
    it("Auto flush cache with autoFlush()", () => {
      const str = `
                struct {
                    u8 a;
                    u16 b;
                }
            `;

      const buf = new Uint8Array([16, 0, 0]).buffer;
      const struct = new QStruct(str).autoFlush();
      assert.strictEqual(struct.decode(buf).toJson().a, 16, 'First "a" is equal 16');
      const buf2 = new Uint8Array([32, 0, 0]).buffer;
      assert.strictEqual(struct.decode(buf2).toJson().a, 32, 'Second "a" is equal 32');
    });

    // With <autoflush>
    it("Auto flush cache with autoFlush()", () => {
      const str = `
                <autoflush>
                struct {
                    u8 a;
                    u16 b;
                }
            `;

      const buf = new Uint8Array([16, 0, 0]).buffer;
      const struct = new QStruct(str);
      assert.strictEqual(struct.decode(buf).toJson().a, 16, 'First "a" is equal 16');
      const buf2 = new Uint8Array([32, 0, 0]).buffer;
      assert.strictEqual(struct.decode(buf2).toJson().a, 32, 'Second "a" is equal 32');
    });
  });

  describe("Anonymous struct test", () => {
    it("Endiannes is same", () => {
      const testNumber = new Uint8Array(new Uint16Array([1]).buffer);
      const isLittleEndian = testNumber[0] === 1;

      const str = `
                struct {
                    u8 a;
                }
            `;
      const buf = new Uint8Array([16]).buffer;
      const struct = new QStruct(str);
      assert.strictEqual(struct.isLittleEndian, isLittleEndian, "Endiannes is different");
    });

    it("uint8 element and equal 16", () => {
      const str = `
                struct {
                    u8 a;
                }
            `;
      const buf = new Uint8Array([16]).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.strictEqual(obj.a, 16, "first element is not equal 16");
    });

    it("int8 element and equal -16", () => {
      const str = `
                struct {
                    i8 a;
                }
            `;
      const buf = new Int8Array([-16]).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.strictEqual(obj.a, -16, "first element is not equal -16");
    });

    it("uint8 element and not equal -16", () => {
      const str = `
                struct {
                    u8 a;
                }
            `;
      const buf = new Int8Array([-16]).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.notEqual(obj.a, -16, "first element is not equal -16");
    });

    it("uint16 element and equal 3124", () => {
      const str = `
                struct {
                    u16 a;
                }
            `;
      const buf = new Uint16Array([3124]).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.strictEqual(obj.a, 3124, "first element is not equal 3124");
    });

    it("uint32 element and equal 593124", () => {
      const str = `
                struct {
                    u32 a;
                }
            `;
      const buf = new Uint32Array([593124]).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.strictEqual(obj.a, 593124, "first element is not equal 593124");
    });

    it("uint64 element and equal 593124", () => {
      const str = `
                struct {
                    u64 a;
                }
            `;
      const max64 = 2n ** 64n - 1n;
      const buf = new BigUint64Array([max64]).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.strictEqual(obj.a, max64, `first element is not equal ${max64}`);
    });

    it("int64 element and equal 593124", () => {
      const str = `
                struct {
                    i64 a;
                }
            `;
      const max64 = 2n ** (64n - 1n) - 1n;
      const buf = new BigInt64Array([max64]).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.strictEqual(obj.a, max64, `first element is not equal ${max64}`);
    });

    it("element is u8 array", () => {
      const str = `
                struct {
                    u8 a[3];
                }
            `;

      const buf = new Uint8Array([15, 16, 17]).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.deepEqual(obj.a, [15, 16, 17], "element is not a uin8 array");
    });

    it("element is u16 array", () => {
      const str = `
                struct {
                    u16 a[3];
                }
            `;
      const arr = [4566, 2331, 982];
      const buf = new Uint16Array(arr).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.deepEqual(obj.a, arr, "element is not a uin32 array");
    });

    it("element is u32 array", () => {
      const str = `
                struct {
                    u32 a[3];
                }
            `;

      const arr = [90000, 120000, 34000000];
      const buf = new Uint32Array(arr).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.deepEqual(obj.a, arr, "element is not a uin32 array");
    });

    it("element is chars", () => {
      const str = `
                struct {
                    char a[5]
                }
            `;

      const buf = Uint8Array.from("hello".split("").map((w) => w.charCodeAt(0))).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.deepEqual(obj.a, "hello", 'string is not "hello"');
    });

    it("variable length element", () => {
      const str = `
                struct {
                    u8 a;
                    u8 b[$a];
                }
            `;

      const arr = [3, 4, 5, 6];
      const buf = new Uint8Array(arr).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.strictEqual(obj.a, 3, "size is not 3");
      assert.deepEqual(obj.b, arr.slice(1), "array is not [4,5,6]");
    });

    it("variable length string", () => {
      const str = `
                struct {
                    u8 a;
                    char b[$a];
                }
            `;
      const text = "hello";
      const arr = [text.length, ...new TextEncoder().encode(text)];
      const buf = new Uint8Array(arr).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.strictEqual(obj.a, text.length, `size is not ${text.length}`);
      assert.deepEqual(obj.b, text, `array is not "${text}"`);
    });

    it("compact type", () => {
      const str = `
                struct {
                    u8 index;
                    u8 phone_size;
                    uchar phone[$phone_size]
                    u8 address_size;
                    string address[$address_size];
                }
            `;

      const index = 12;
      const phone = "+010988888";

      const address = "Phnoix.";
      const arr = [
        index,
        phone.length,
        ...new TextEncoder().encode(phone),
        address.length,
        ...new TextEncoder().encode(address),
      ];

      const buf = new Uint8Array(arr).buffer;
      const struct = new QStruct(str);
      const obj = struct.decode(buf).toJson();
      assert.strictEqual(obj.index, index, `index is not ${index}`);
      assert.strictEqual(obj.phone_size, phone.length, `phone size is not ${phone.length}`);
      assert.strictEqual(obj.address, address, `addres is not '${address}'`);
      assert.strictEqual(obj.phone_size, phone.length, `phone size is not ${phone.length}`);
      assert.strictEqual(obj.phone, phone, `phone is not '${phone}'`);
    });
  });
});
