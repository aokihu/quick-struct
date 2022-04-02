"use strict";
var C_TYPES;
(function (C_TYPES) {
})(C_TYPES || (C_TYPES = {}));
const LINE_PARTTEN = /(\S+)\s(\w+)(\[(\d+)\])?/g;
const ELEMENT_PARTTEN = /(\S+)\[(\d+)\]/;
class JSCStruct {
    constructor(rawString) {
        this._rawString = '';
        this._keyNames = [];
        this._dataset = [];
        this._rawString = rawString;
        this.compile();
    }
    compile() {
    }
}
