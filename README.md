![quick-struct banner](https://github.com/aokihu/quick-struct/blob/main/banner.jpg?raw=true)

# quick-struct

**quick-struct** is the tools for parsing and unpacking binary data formats into data formats that JavaScript can easily handle. The developer can define the data format using a string definition similar to the C language style. In order to eliminate the defect of inconsistent byte length between different CPU architectures and operating systems, the data type keyword of the **Rust** language is used to define the data type.

Below is the example of struct definition

```c
struct {
         u8 a;
         u8 b;
         u16 c;
}
```

It's very easy, **u8** is an unsigned byte(8 bit) and **u16** is 2 unsinged bytes.

Type and byte length

| Byte length  | signed | unsigned | Support |
| :----------: | :----: | :------: | :-----: |
|    8-bit     |   i8   |    u8    |   Yes   |
|    16-bit    |  i16   |   u16    |   Yes   |
|    32-bit    |  i32   |   u32    |   Yes   |
|    64-bit    |  i64   |   u64    |   Yes   |
|   128-bit    |  i128  |   u128   |   No    |
|     arch     | isize  |  usize   |   No    |
| float-32-bit |  f32   |    -     |   Yes   |
| float-64-bit |  f64   |    -     |   Yes   |
|    8-bit     |  char  |  uchar   |   Yes   |

## Install

You can use `npm` or `yarn` install.

```bash
# use yarn
yarn add quick-struct

#use npm
npm install quick-struct
```

## Usage

### Basic

You can use `qs` template string function to create a new `QStruct` instance.

```javascript
import { qs } from "quick-struct";

const struct = qs`
    struct {
        u8 a;
    }
`;

// Create a UInt8 array
const buffer = new UInt8Array([12]);

// Decode buffer
const result = struct.decode(buffer).toJson();

// Print decoded result
console.log(result.a);
```

You can also use `JSSctruct` to create instance. Becase this is library is called **"js-cstruct"** before, so the calss name is **"QStruct"**. Two ways is the same, but I'd like template string function version.

```javascript
import { QStruct } from "quick-struct";

const structDescriptor = `
    struct {
        u8 a;
    }
`;

const struct = new QStruct(structDescriptor);

// Create a UInt8 array
const buffer = new UInt8Array([12]);

// Decode buffer
const result = struct.decode(buffer).toJson();

// Print decoded result
console.log(result.a); // 12
```

### Multi fields

**quick-struct** support define multi fields, the result of _JSON_ will combin field's name and value automatic, you can use the result as normal JavaScript object.

```javascript
import { qs } from "quick-struct";

const struct = qs`
    struct {
        u8 a;
        u8 b;
        u8 c;
    }
`;

// Create a UInt8 array
const buffer = new UInt8Array([12, 16, 32]);

// Decode buffer
const result = struct.decode(buffer).toJson();

// Print decoded result
console.log(result.a); // 12
console.log(result.b); // 16
console.log(result.c); // 32
```

### Digital Array and string

**quick-struct** can automatically identify numeric arrays and strings, and it is similar to the C language declaration when used. For numeric arrays, the array form will be automatically generated, and the strings will be automatically merged into the String type.quick-struct can automatically identify numeric arrays and strings, and it is similar to the C language declaration when used. For numeric arrays, the array form will be automatically generated, and the strings will be automatically merged into the String type.

When a numeric type is declared as an array, it will be counted as an array type, regardless of whether the array length is 1.

```javascript
import { qs } from "quick-struct";

const struct = qs`
    struct {
        u8 a[3];
     uchar b[5];
    }
`;

// Create a UInt8 array
const text = new TextEncoder().encode("hello");
const buffer = new UInt8Array([12, 13, 14, ...text]);

// Decode buffer
const result = struct.decode(buffer).toJson();

// Print decoded result
console.log(result.a); // [12, 13, 14]
console.log(result.b); // "hello"
```

### Variable length array and string

**quick-struct** supports automatic parsing of variable-length arrays or strings. The usage method is also very simple. Just change the fixed length of the array to the field name with the array length. The first character of the field name must be the **'\$'** symbol , indicating that this is a variable-length array or string, and the field must be declared before the variable array or string

```javascript
// Correct way
const struct = qs`
       struct {
           u8 a;
         char b[$a];
       }
 `;
const text = "hello";
const arr = [text.length, ...new TextEncoder().encode(text)];
const buf = new Uint8Array(arr);
const result = struct.decode(buf).toJson();

// print output
console.log(result.a); // 5 <- string length
console.log(result.b); // 'hello'

// Incorrect way
const struct = qs`
      struct {
          char a[$b];
            u8 b;
      }
 `;
```

### Endianness

**quick-struct** uses DataView for binary data parsing. The input binary is in big-endian mode, which is no problem for network communication, but the computers we use are usually in little-endian mode. We can parse by setting the endianness mode. binary data in little endian mode. Default mode is big-endian, so you don't need change it normaly.

```javascript
import { qs } from "quick-struct";

const struct = qs`
    struct {
        u8 a[3];
     uchar b[5];
    }
`;

// Create a UInt8 array
const text = new TextEncoder().encode("hello");
const buffer = new UInt8Array([12, 13, 14, ...text]);

// Set little-endian mode
const result = struct.setLittleEndian().decode(buffer).toJson();

// set big-endian mode
const result = struci.setBigEndian().decode(buffer).toJson();

// Print decoded result
console.log(result.a); // [12, 13, 14]
console.log(result.b); // "hello"
```

## Export and import struct layout

In order to keep the data structure information confidential, **quick-struct** provides export and import of parsed structure data, which is saved in Base64 string format. Users can use other encryption and decryption methods to do secondary processing on the output string.

```javascript
// Export structer
const struct = qs`
   struct {
       u8 a;
      u32 b;
   }
`;
layout = struct.exportStructs();

// Import structor
const struct = new QStruct();
struct.importStructs(layout);
```

## Flush

Decoded buffer data will stored till `flush()` trigger, so if you want decode different binary data with one `quick-struct` instance, you must `flush` cache after `toJson()` or `toJSON()`

```javascript
import { qs } from "quick-struct";

const struct = qs`
    struct {
        u8 a;
    }
`;

// Create the first UInt8 array
const buffer = new UInt8Array([12]);

// Decode buffer
const result = struct.decode(buffer).toJson();

// Print decoded result
console.log(result.a); // print '12'

// Create the second Uint8 array
const buffer2 = new Uint8Array([32]);
const result2 = struct.decode(buffer2).toJson();

// Without flush()
console.log(result2.a); // print '12'

// With flush()
struct.flush();
console.log(result2.a); // print '32'
```

You can use instance method `autoFlush()` to flush cache when output `toJson()` executed automaticly.

```javascript
import { qs } from "quick-struct";

/* ----------- TWO WAYS ------------ */

/* 1. Instance method */
const struct = qs`
    struct {
        u8 a;
    }
`.autoFlush();

/* 2. Struct attribute */
const struct = qs`
    <autoflush>
    struct {
        u8 a;
    }
`;

/* -------------------------------- */

// Create the first UInt8 array
const buffer = new UInt8Array([12]);

// Decode buffer
const result = struct.decode(buffer).toJson();

// Print decoded result
console.log(result.a); // print '12'

// Create the second Uint8 array
const buffer2 = new Uint8Array([32]);
const result2 = struct.decode(buffer2).toJson();

console.log(result2.a); // print '32'
```

## API

`qs` template string function, it return a new **QStruct**

`QStruct(structDescriptor: string)` Constructor, the parameter is the structure description string

`QStruct.prototype.decode(buffer: ArrayBuffer)` Decode binary array data and store result in memory

`QStruct.prototype.toJson()` Ouptu the result with JSON type, you can use `toJSON()`, it's a.k.a. `toJson()`
