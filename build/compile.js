"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStructBlocks = void 0;
const STRUCT_BLOCK_PARTTEN = "\\bstruct(?<name>\\w*)\\{(?<body>\\S*?)\\}";
const STRUCT_LINE_PARTTEN = /(\S+)\s(\w+)(\[(\d+)\])?/g;
const findStructBlocks = (descriptor, fromIndex = 0) => {
    const regexp = new RegExp(STRUCT_BLOCK_PARTTEN, 'g');
    const desc = preprocess(descriptor);
    const structs = [];
    let result;
    while ((result = regexp.exec(desc)) !== null) {
        let [_, _name, _body] = result;
        _name = _name === '' ? 'default' : _name;
        structs.push([_name, _body]);
    }
    return structs.length === 0 ? null : structs.length > 1 ? structs : structs[0];
};
exports.findStructBlocks = findStructBlocks;
const preprocess = (descriptor) => (descriptor.trim().replace(/\s/g, ''));
exports.default = (descriptor) => {
    const blocks = (0, exports.findStructBlocks)(descriptor);
};
