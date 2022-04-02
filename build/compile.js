"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = exports.findStructBlocks = void 0;
const findStructBlocks = (descriptor, fromIndex = 0) => {
    const regexp = /\bstruct(?<name>\w*)\{(?<body>\S*?)\}/g;
    const desc = descriptor.trim().replace(/\s/g, '');
    const structs = [];
    let result;
    while ((result = regexp.exec(desc)) !== null) {
        let [_, _name, _body] = result;
        _name = _name === '' ? 'default' : _name;
        structs.push([_name, _body]);
    }
    return structs;
};
exports.findStructBlocks = findStructBlocks;
const parseBody = (body) => {
    const regexp = /(?<type>u8|i8|u16|i16|u32|i32|u64|i64|char|uchar|string)(?<name>\w+)(?:\[(\d+)\])?;??/g;
    const rows = [];
    let result;
    while ((result = regexp.exec(body)) !== null) {
        let [_, _type, _name, _length] = result;
        let _len = _length ? Number(_length) : 1;
        rows.push([_type, _name, _len]);
    }
    return rows;
};
exports.parseBody = parseBody;
exports.default = (descriptor) => {
    const blocks = (0, exports.findStructBlocks)(descriptor);
    return blocks.map((b) => {
        const _name = b[0];
        const _body = b[1];
        const _rows = (0, exports.parseBody)(_body);
        return [_name, _rows];
    });
};
