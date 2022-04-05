import assert from 'assert';
import { qs } from '../build/index.js'

describe("String template testcase", () => {

    it("simple struct", () => {

        const struct = qs`
            struct {
                u8 a;
            }
        `

        const buffer = new Uint8Array([16]);
        const result = struct.decode(buffer).toJSON()
        assert.strictEqual(result.a, 16, 'a is not 16')

    })

})