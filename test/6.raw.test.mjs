import assert from "assert";
import { qs } from "../build/index.js";

describe("Raw type test cases", () => {
  /* Fixed length test case */
  it("Fixed length raw data", () => {
    const struct = qs`
            <autoflush>
            struct {
                raw a[8];
            }
        `;

    const bin = new Uint16Array([128, 256, 512, 1024]).buffer;
    const result = struct.decode(bin);
    assert.equal(result.a.byteLength, 8, "Byte length is 8");
  });
});
