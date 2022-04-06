import assert from 'assert';
import { qs } from '../build/index.js'

describe("String template testcase", () => {

    it("simple struct", () => {

        const struct = qs`
            struct {
                u8 a;
            }
        `

        const buffer = new Uint8Array([16]).buffer;
        const result = struct.decode(buffer).toJSON()
        assert.strictEqual(result.a, 16, 'a is not 16')

    })

    it("long range variable length string", () => {

        const struct = qs`
            struct {
                u8 len;
               u16 b;
              char message[$len];
            }
        `

        const message = "hello world!"
        const buffer = new Uint8Array([message.length, 0x0, 0x1, ...(new TextEncoder).encode(message)]).buffer
        const result = struct.decode(buffer).toJSON()
        assert.strictEqual(result.len, message.length, `len is not ${message.length}`)
        assert.deepEqual(result.message, message, `message is not "${message}"`)

    })

})