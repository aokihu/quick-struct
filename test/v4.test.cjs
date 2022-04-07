const {qs} = require('../build/index.js')

describe("Encode testcases", () => {

    it("", () => {
        const struct = qs`
            struct {
                u8 a;
                u16 size;
                u8 speed[3];
                char msg[$size];
            }
        `
        
        const obj = {
            a: 128,
            msg: "hello world!",
            speed: [10, 2, 13]
        }

        const buf = struct.encode(obj)
        console.log(buf)
    })


})