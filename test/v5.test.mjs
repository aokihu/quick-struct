import assert from 'assert';
import {qs, QStruct} from '../build/index.js'

describe("Export and import testcases", () => {

    let layout;
    let description;

    it("Export struct layout", () => {
        const struct = qs`
            struct {
                u8 a;
                u32 b;
            }
        `

        layout = struct.exportStructs();
        description = struct.description;
        assert.ok(layout.endsWith('=='), 'The format is wrong')
    })

    it("Import struct layout", () => {
        const struct = new QStruct();
        struct.importStructs(layout);
        assert.deepEqual(struct.description, description, "Struct description is wrong")
    })
    
    it("Import struct layout and decode binary", () => {
        const struct = new QStruct();
        struct.importStructs(layout);
        const buffer = new Uint8Array([32, 0, 0 ,0, 16]).buffer
        const obj = struct.setBigEndian().decode(buffer).toJson()
        assert.strictEqual(obj.a, 32, 'Member "a" is not equal 32')
        assert.strictEqual(obj.b, 16, 'Member "b" is not equal 16')
    })
    

})