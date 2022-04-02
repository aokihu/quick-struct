import {JSCStruct} from '../build/index.js'

describe("JSCStruct class test", () => {

    it("Anonymous struct test", () => {
        const str = `
            struct {
                u8 first;
                u8 second;
            }
        `

        const buf = new Uint8Array([16,12,32,64,128,256])
        const struct = new JSCStruct(str);
        struct.decode(buf)
    })

})