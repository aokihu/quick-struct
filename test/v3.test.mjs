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
            const buf = new Uint8Array([16])
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
            const buf = new Int8Array([-16])
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
            const buf = new Int8Array([-16])
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
            const buf = new Uint16Array([3124])
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
            const buf = new Uint32Array([593124])
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

            const buf = new Uint8Array([15, 16, 17])
            const struct = new JSCStruct(str)
            const obj = struct.decode(buf).toJson()
            assert.deepEqual(obj.a, [15, 16, 17], 'element is not a uin8 array')
        })

        it("element is chars", () => {

            const str = `
                struct {
                    char a[5]
                }
            `

            const buf = Uint8Array.from("hello".split('').map(w => w.charCodeAt(0)))
            const struct = new JSCStruct(str)
            const obj = struct.decode(buf).toJson();
            assert.deepEqual(obj.a, 'hello', 'string is not "hello"')

        })
        

        it("variable length element", () => {

            const str = `
                struct {
                    u8 a<size:b>;
                    u8 b[];
                }
            `

            const buf = new Uint8Array([3, 1, 2, 3])
            const struct = new JSCStruct(str)
            const obj = struct.decode(buf).toJson()
            assert.strictEqual(obj.a, 3, 'size is not 3')
            assert.deepEqual(obj.b, [1, 2, 3], 'array is not [1, 2, 3]')

        })

        
    })

    

})