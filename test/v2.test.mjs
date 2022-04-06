import assert from 'assert'
import { JSCStruct } from '../build/index.js'

describe("JSCStruct class test", () => {

    describe("Anonymous struct test", () => {

        it("uint8 element and equal 16", () => {
            const str = `
                struct {
                    u8 a;
                }
            `
            const buf = new Uint8Array([16]).buffer
            const struct = new JSCStruct(str);
            const obj = struct.decode(buf).toJson();
            assert.strictEqual(obj.a, 16, 'first element is not equal 16')
        })

        it("int8 element and equal -16", () => {
            const str = `
                struct {
                    i8 a;
                }
            `
            const buf = new Int8Array([-16]).buffer
            const struct = new JSCStruct(str);
            const obj = struct.decode(buf).toJson();
            assert.strictEqual(obj.a, -16, 'first element is not equal -16')
        })

        it("uint8 element and not equal -16", () => {
            const str = `
                struct {
                    u8 a;
                }
            `
            const buf = new Int8Array([-16]).buffer
            const struct = new JSCStruct(str);
            const obj = struct.decode(buf).toJson();
            assert.notEqual(obj.a, -16, 'first element is not equal -16')
        })

        it("uint16 element and equal 3124", () => {
            const str = `
                struct {
                    u16 a;
                }
            `
            const buf = new Uint16Array([3124]).buffer
            const struct = new JSCStruct(str);
            const obj = struct.decode(buf).toJson();
            assert.strictEqual(obj.a, 3124, 'first element is not equal 3124')
        })

        it("uint32 element and equal 593124", () => {
            const str = `
                struct {
                    u32 a;
                }
            `
            const buf = new Uint32Array([593124]).buffer
            const struct = new JSCStruct(str);
            const obj = struct.decode(buf).toJson();
            assert.strictEqual(obj.a, 593124, 'first element is not equal 593124')
        })

        it("element is u8 array", () => {
            const str = `
                struct {
                    u8 a[3];
                }
            `

            const buf = new Uint8Array([15, 16, 17]).buffer
            const struct = new JSCStruct(str)
            const obj = struct.decode(buf).toJson()
            assert.deepEqual(obj.a, [15, 16, 17], 'element is not a uin8 array')
        })

        it("element is u16 array", () => {
            const str = `
                struct {
                    u16 a[3];
                }
            `
            const arr = [4566, 2331, 982]
            const buf = new Uint16Array(arr).buffer
            const struct = new JSCStruct(str)
            const obj = struct.decode(buf).toJson()
            assert.deepEqual(obj.a, arr, 'element is not a uin32 array')
        })


        it("element is u32 array", () => {
            const str = `
                struct {
                    u32 a[3];
                }
            `

            const arr = [90000, 120000, 34000000]
            const buf = new Uint32Array(arr).buffer
            const struct = new JSCStruct(str)
            const obj = struct.decode(buf).toJson()
            assert.deepEqual(obj.a, arr, 'element is not a uin32 array')
        })

        it("element is chars", () => {

            const str = `
                struct {
                    char a[5]
                }
            `

            const buf = Uint8Array.from("hello".split('').map(w => w.charCodeAt(0))).buffer
            const struct = new JSCStruct(str)
            const obj = struct.decode(buf).toJson();
            assert.deepEqual(obj.a, 'hello', 'string is not "hello"')

        })


        it("variable length element", () => {

            const str = `
                struct {
                    u8 a;
                    u8 b[];
                }
            `

            const arr = [3, 4, 5, 6]
            const buf = new Uint8Array(arr).buffer
            const struct = new JSCStruct(str)
            const obj = struct.decode(buf).toJson()
            assert.strictEqual(obj.a, 3, 'size is not 3')
            assert.deepEqual(obj.b, arr.slice(1), 'array is not [4,5,6]')

        })


        it("variable length string", () => {

            const str = `
                struct {
                    u8 a;
                    char b[];
                }
            `
            const text = "hello"
            const arr = [text.length, ...(new TextEncoder()).encode(text)]
            const buf = new Uint8Array(arr).buffer
            const struct = new JSCStruct(str)
            const obj = struct.decode(buf).toJson()
            assert.strictEqual(obj.a, text.length, `size is not ${text.length}`)
            assert.deepEqual(obj.b, text, `array is not "${text}"`)
        })

        it("compact type", () => {

            const str = `
                struct {
                    u8 index;
                    u8 phone_size;
                    char phone[]
                    u8 address_size;
                    char address[];
                }
            `

            const index = 12
            const phone = "+010988888"

            const address = "Phnoix."
            const arr = [index,
                phone.length,
                ...(new TextEncoder()).encode(phone),
                address.length,
                ...(new TextEncoder()).encode(address)
            ]

            const buf = new Uint8Array(arr).buffer
            const struct = new JSCStruct(str)
            const obj = struct.decode(buf).toJson()
            assert.strictEqual(obj.index, index, `index is not ${index}`)
            assert.strictEqual(obj.phone_size, phone.length, `phone size is not ${phone.length}`)
            assert.strictEqual(obj.address, address, `addres is not '${address}'`)
            assert.strictEqual(obj.phone_size, phone.length, `phone size is not ${phone.length}`)
            assert.strictEqual(obj.phone, phone, `phone is not '${phone}'`)
        })

    })



})