/**
 *
 * Testcase
 * @file 1.compile.test.mjs
 * @description Test compile functions
 *
 */

import assert from "assert";
import {
  findStructBlocks,
  parseBody,
  parseStructAttribute,
} from "../build/compile.js";

/* -------------------------- */
/*       Struct name test     */
/* -------------------------- */

describe("Struct name test", () => {
  // Test default struct
  it("Anonymous struct", () => {
    const str = `
        struct {
                u8 a;
                u8 b;
                u16 c;
        }
    `;
    const [name, _] = findStructBlocks(str)[0];
    assert.equal(name, "default", 'default name is "default"');
  });

  // Named struct
  it("Struct name is 'Person', it will return 'Person'", () => {
    const str = `
        struct Person {
            u8 a;
            u8 b;
            u16 c;
        }
    `;
    const [name, _] = findStructBlocks(str)[0];
    assert.equal(name, "Person", 'name is "Person"');
  });
});

/* --------------------------- */
/*     Structs length test     */
/* --------------------------- */
describe("Structs length test", () => {
  // 2 Structs
  it("2 Struct", () => {
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
});

/* ----------------------- */
/*       Fields Test       */
/* ----------------------- */

describe("Fields test", () => {
  // 2 Fields
  it("2 Fileds", () => {
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

/* ----------------------- */
/*     Struct Attribute    */
/* ----------------------- */

describe("Struct attribute test", () => {
  // <ver>
  it("Attribute: <ver>", () => {
    const str = `
            <ver: 1>
            struct {
                char name[16];
            }
        `;
    const attrs = parseStructAttribute(str);
    assert.equal(attrs["ver"], 1, '"ver" is 1');
  });

  // <autoflush>
  it("Attribute: <autoflush>", () => {
    const str = `
            <autoflush>
            struct {
                char name[16];
            }
        `;
    const attrs = parseStructAttribute(str);
    assert.equal(attrs["autoflush"], true, '"autoflush" is true');
  });

  // <endian>
  it("Attribute: <endian: little>", () => {
    const str = `
            <endian: little>
            struct {
                char name[16];
            }
        `;
    const attrs = parseStructAttribute(str);
    assert.deepEqual(attrs["endian"], "little", '"endian" is little');
  });

  // <ver> and <autoflush>
  it("Attribute: <ver> and <autoflush>", () => {
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
