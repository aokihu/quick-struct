"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStructBlocks = void 0;
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
    return structs.length === 0 ? null : structs.length > 1 ? structs : structs[0];
};
exports.findStructBlocks = findStructBlocks;
exports.default = (descriptor) => {
    const blocks = (0, exports.findStructBlocks)(descriptor);
};
