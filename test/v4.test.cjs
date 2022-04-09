const assert = require('assert')
const {qs} = require('../build/index.js')

function randomSize() {
    return Math.floor(Math.random()*(100))
}

describe("Encode testcases", () => {

    it("Uint8 encode", () => {
        const struct = qs`
            struct {
                u8 a;
            }
        `
        const obj = {
            a: 128,
        }

        const buf = struct.encode(obj)
        const dv = new DataView(buf);

        assert.strictEqual(dv.getUint8(0), 128, "Member 'a' is not equal 128");
    })

    it("Uint8 array with fixed length", () => {

        const struct = qs`
            struct {
                u8 a[5]
            }
        `

        const obj = {
            a: [0, 1, 2, 3, 4]
        }

        const buf = struct.encode(obj);
        const dv = new DataView(buf);

        obj.a.forEach((val, i) => {
            assert.strictEqual(dv.getUint8(i), val, `Array[${i}] is not equal ${val}`)
        })

    })

    it("Uint16 array with fixed length", () => {
        const struct = qs`
            struct {
                u16 a[5]
            }
        `

        const obj = {
            a: [0, 1, 2, 3, 4]
        }

        const buf = struct.encode(obj);
        const dv = new DataView(buf);

        obj.a.forEach((val, i) => {
            assert.strictEqual(dv.getUint16(i * 2), val, `Array[${i}] is not equal ${val}`)
        })
    })

    it("Uint32 array with fixed length", () => {
        const struct = qs`
            struct {
                u32 a[5]
            }
        `

        const obj = {
            a: [0, 1, 2, 3, 4]
        }

        const buf = struct.encode(obj);
        const dv = new DataView(buf);

        obj.a.forEach((val, i) => {
            assert.strictEqual(dv.getUint32(i * 4), val, `Array[${i}] is not equal ${val}`)
        })
    })

    it("Uint8 array with variable length", () => {

        const struct = qs`
            struct {
                u8 size;
                u8 data[$size];
            }
        `

        const size = randomSize()
        const testArray = [...(new Array(size)).keys()]
        const obj = {
            data: testArray
        }
        const buf = struct.encode(obj)
        const dv = new DataView(buf);

        assert.strictEqual(buf.byteLength, size + 1, `Buffer byte length is not ${1 + size}`)
        assert.strictEqual(dv.getUint8(0), size, `Array length is not equal ${size}`)
        testArray.forEach((v, i) => {
            assert.strictEqual(dv.getUint8(1+i), v, `Array[${i}] is not equal ${v}`)
        })
    })

    it("String with fixed length", () => {
        const struct = qs`
            struct {
                uchar msg[5];
            }
        `

        const msg = 'hello'
        const buf = struct.encode({msg});
        const codes = (new TextEncoder()).encode(msg).buffer;
        assert.deepEqual(buf, codes, `'msg' is not "hello"`)
    })


})