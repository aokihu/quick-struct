import { JSCStruct } from '../build/index.js'

describe("JSCStruct class test", () => {

    it("Anonymous struct test", () => {
        const str = `
            struct {
                u8 first;
                u8 second[2];
                string word[5];
            }
        `

        const buf = new Uint8Array([16, 12, 32, 0x68, 0x65, 0x6c, 0x6c, 0x6f])
        const struct = new JSCStruct(str);
        const obj = struct.decode(buf).toJson();
    })

})