import * as assert from 'assert'
import cstruct from '../src/index.mjs'

describe("V 1.0 Test case", () => {
    it("'a' is u8, a = 2", () => {
        const mstruct = cstruct`
        struct {
            u8 a;
            u8 b;
            i8 c
        }
        `
        mstruct.parse((new Uint8Array([2, 3, 4])).buffer);
        assert.strictEqual(mstruct.toJson().a, 2, '');
    })

    it("'c' is i8, c = -4", () => {
        const mstruct = cstruct`
        struct {
            u8 a;
            u8 b;
            i8 c;
        }
        `

        mstruct.parse((new Int8Array([2, 3, -4])).buffer);
        assert.strictEqual(mstruct.toJson().c, -4, '')
    })

    it("'a' is u8, a != -2", () => {
        const mstruct = cstruct`
        struct {
            u8 a;
            u8 b;
            i8 c;
        }
        `

        mstruct.parse((new Int8Array([-2, 3, -4])).buffer);
        const data = mstruct.toJson();
        assert.notStrictEqual(data.a, -2, '')
    })


    it("'d' is char, d = 'd'", () => {
        const mstruct = cstruct`
        struct {
            u8 a;
            u8 b;
            i8 c;
            char d;
        }
        `

        mstruct.parse((new Int8Array([-2, 3, -4, 'd'.charCodeAt(0)])).buffer);
        const data = mstruct.toJson();
        assert.strictEqual(data.d, 'd', '')
    })

    it("'e' is u8 array, length is 2", () => {
        const mstruct = cstruct`
        struct {
            u8 a;
            u8 b;
            i8 c;
            char d;
            u8 e[2];
        }
        `

        mstruct.parse((new Int8Array([-2, 3, -4, 'd'.charCodeAt(0), 100, 101])).buffer);
        const data = mstruct.toJson();
        console.log(data)
        assert.deepStrictEqual(data.e.length, 2, '')

    })


})