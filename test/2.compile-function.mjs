import assert from "assert";
import { compile } from "../build/compile.js";

describe("Test compile()", () => {
  it("Return only one result set", () => {
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

  it("Type string", () => {
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
