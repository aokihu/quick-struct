const assert = require('assert')
const {findStructBlocks} = require('../build/compile.js')

describe("Test compile methods", () => {
    it("No name struct, it will return 'default'", () => {
        const str = `
            struct {
                u8 a;
                u8 b;
                u16 c;
            }
        `
        const [name, _] = findStructBlocks(str)[0]
        assert.equal(name, 'default', 'default name is error')
    })
    
    it("Struct name is 'Person', it will return 'Person'", () => {
        const str = `
            struct Person {
                u8 a;
                u8 b;
                u16 c;
            }
        `
        const [name, _] = findStructBlocks(str)[0]
        assert.equal(name, 'Person', 'name is not "Person"')
    })

    it("2 Struct definition, length equal 2", () => {
        const str = `
            struct Animal0 {
                u8 a;
                u16 c;
            }

            struct Person {
                u8 a;
                u8 b;
                u16 c;
            }
        `
        const structs = findStructBlocks(str)
        assert.equal(structs.length, 2, 'length is not 2')
        assert.equal(structs[0][0], 'Animal0', 'name is not "Animal0"')
        assert.equal(structs[1][0], 'Person', 'name is not "Person"')
    })
})