"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSCStruct = void 0;
var C_TYPES;
(function (C_TYPES) {
})(C_TYPES || (C_TYPES = {}));
'./compile';
const compile_1 = require("./compile");
class JSCStruct {
    constructor(rawString) {
        this._rawString = '';
        this._keyNames = [];
        this._blocks = [];
        this._rawString = rawString;
        this._blocks = (0, compile_1.compile)(rawString);
    }
    findStruckBlock(name = 'default') {
        return this._blocks.find(b => b[0] === name);
    }
    decode(buffer, structName = 'default') {
        const struct = this.findStruckBlock(structName);
        const [name, fields] = struct;
        let pos = 0;
        let offset = 0;
        let idx = 0;
        let buf;
        for (; idx < fields.length; idx += 1) {
            const field = fields[idx];
            const _type = field[0];
            const _name = field[1];
            const _len = field[2];
            offset = pos + _len;
            buf = buffer.slice(pos, offset);
            console.log(pos, buf);
            pos += offset;
        }
        console.log(name, fields);
    }
}
exports.JSCStruct = JSCStruct;
