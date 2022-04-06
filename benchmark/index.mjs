import { JSCStruct } from '../build/index.js'

console.log("Benchmark v0.0.1")

const StructString = `
    struct {
        u8 a;
    }
`

console.time("construct")
let struct = new JSCStruct(StructString)
console.timeEnd("construct")

const testU8 = new Uint8Array([12]).buffer

console.time("100-u8-value")
for (let i = 0; i < 100; i += 1) {
    struct.decode(testU8)
}
console.timeEnd("100-u8-value")

console.time("1000-u8-value")
for (let i = 0; i < 1000; i += 1) {
    struct.decode(testU8)
}
console.timeEnd("1000-u8-value")

console.time("10000-u8-value")
for (let i = 0; i < 10000; i += 1) {
    struct.decode(testU8)
}
console.timeEnd("10000-u8-value")


const StructString2 = `
    struct {
        u8 a;
        u16 b;
        u32 c;
        u8 d[12];
    }
`
const test2 = new Uint8Array([100, 32, 44, 12, 33, 54, 33, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).buffer

console.time("construct")
struct = new JSCStruct(StructString2)
console.timeEnd("construct")

console.time("100-u[8,16,32,64]-value")
for (let i = 0; i < 100; i += 1) {
    struct.decode(test2)
}
console.timeEnd("100-u[8,16,32,64]-value")

console.time("500-u[8,16,32,64]-value")
for (let i = 0; i < 500; i += 1) {
    struct.decode(test2)
}
console.timeEnd("500-u[8,16,32,64]-value")

console.time("1000-u[8,16,32,64]-value")
for (let i = 0; i < 1000; i += 1) {
    struct.decode(test2)
}
console.timeEnd("1000-u[8,16,32,64]-value")

console.time("5000-u[8,16,32,64]-value")
for (let i = 0; i < 5000; i += 1) {
    struct.decode(test2)
}
console.timeEnd("5000-u[8,16,32,64]-value")

console.time("10000-u[8,16,32,64]-value")
for (let i = 0; i < 10000; i += 1) {
    struct.decode(test2)
}
console.timeEnd("10000-u[8,16,32,64]-value")