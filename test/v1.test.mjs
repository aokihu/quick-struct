import assert from "assert";
import {
  findStructBlocks,
  parseBody,
  compile,
  parseStructAttribute,
} from "../build/compile.js";

describe("Test compile methods", () => {
  it("No name struct, it will return 'default'", () => {
    const str = `
            struct {
                u8 a;
                u8 b;
                u16 c;
            }
        `;
    const [name, _] = findStructBlocks(str)[0];
    assert.equal(name, "default", "default name is error");
  });

  it("Struct name is 'Person', it will return 'Person'", () => {
    const str = `
            struct Person {
                u8 a;
                u8 b;
                u16 c;
            }
        `;
    const [name, _] = findStructBlocks(str)[0];
    assert.equal(name, "Person", 'name is not "Person"');
  });

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
        `;
    const structs = findStructBlocks(str);
    assert.equal(structs.length, 2, "length is not 2");
    assert.equal(structs[0][0], "Animal0", 'name is not "Animal0"');
    assert.equal(structs[1][0], "Person", 'name is not "Person"');
  });

  it("Records's length is 2", () => {
    const str = `
            struct {
                u8 a;
                u16 c_1;
            }
        `;
    const structs = findStructBlocks(str);
    const [name, body] = structs[0];
    const rows = parseBody(body);
    assert.equal(name, "default", 'name is not "default"');
    assert.equal(rows.length, 2, "rows length is not 2");
  });
});

describe("Test compile() method", () => {
  it("compile() test, it will return only one result set", () => {
    const str = `
            struct {
                u8 a;
                u16 c_1;
            }
        `;

    const structs = compile(str);
    const struct = structs[0];

    const structName = struct[0];
    const fieldNames = struct[1];
    const fieldDetails = struct[2];

    assert.equal(structs.length, 1, "result set length is not 1");
    assert.equal(structName, "default", 'the name is not "default"');
    assert.equal(fieldDetails[0][0], 10, 'the type is not "u8"');
    assert.equal(fieldNames[0], "a", 'the name is not "a"');
    assert.equal(fieldDetails[1][0], 12, 'the type is not "u16"');
    assert.equal(fieldNames[1], "c_1", 'the name is not "c_1"');
  });

  it("compile() test, char type", () => {
    const str = `
            struct {
                char name[16];
            }
        `;

    const structs = compile(str);
    const struct = structs[0];
    const structName = struct[0];
    const fieldNames = struct[1];
    const fieldDetails = struct[2];

    assert.equal(structs.length, 1, "result set length is not 1");
    assert.equal(structName, "default", 'the name is not "default"');
    assert.equal(fieldDetails[0][0], 20, 'the type is not "char"');
    assert.equal(fieldNames[0], "name", 'the name is not "name"');
    assert.equal(fieldDetails[0][2], 16, "the length is not 16");
  });
});

describe("Test parseStructAttributes() method", () => {
  it("Attribute: 'version'", () => {
    const str = `
            <ver: 1>
            struct {
                char name[16];
            }
        `;
    const attrs = parseStructAttribute(str);
    assert.equal(attrs["ver"], 1, '"ver" is 1');
  });

  it("Attribute: 'autoflush'", () => {
    const str = `
            <autoflush>
            struct {
                char name[16];
            }
        `;
    const attrs = parseStructAttribute(str);
    assert.equal(attrs["autoflush"], true, '"autoflush" is true');
  });

  it("Attribute: 'endian'", () => {
    const str = `
            <endian: little>
            struct {
                char name[16];
            }
        `;
    const attrs = parseStructAttribute(str);
    assert.deepEqual(attrs["endian"], "little", '"endian" is little');
  });

  it("Attribute: 'version' and 'autoflush'", () => {
    const str = `
            <ver: 1>
            <autoflush>
            struct {
                char name[16];
            }
        `;
    const attrs = parseStructAttribute(str);
    assert.strictEqual(attrs["autoflush"], true, '"autoflush" is true');
    assert.strictEqual(attrs["ver"], 1, '"ver" is 1');
  });
});
