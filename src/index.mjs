/**
 * js-cstruct
 * 
 * @author aokihu <aokihu@mail.com>
 * @version 1.0.0
 * @license MIT
 */

const C_TYPES = {
    'char': [Uint8Array, 1],
    'uchar': [Uint8Array, 1],
    'i8': [Int8Array, 1],
    'u8': [Uint8Array, 1],
    'i16': [Int16Array, 2],
    'u16': [Uint16Array, 2],
    'i32': [Int32Array, 4],
    'u32': [Uint32Array, 4],
    'i64': [Int16Array, 8],
    'u64': [BigUint64Array, 8]
}

const LINE_PARTTEN = /(\S+)\s(\w+)(\[(\d+)\])?/g
const ELEMENT_PARTTEN = /(\S+)\[(\d+)\]/

class JSCStruct {
    constructor(str) {
        this.string = str;
        this.pairs = [];
        this.data = [];

        this.compile();
    }

    compile() {
        // remove '\n'
        this.string = this.string.replaceAll('\n', '');

        const headBracketIndex = this.string.indexOf('{');
        const tailBracketIndex = this.string.indexOf('}', headBracketIndex);
        const ss = this.string.substring(headBracketIndex + 1, tailBracketIndex)
        this.string = this.string.trim()

        const matchs = ss.match(LINE_PARTTEN)

        // trim
        this.pairs = [];

        /**
         * save as array like ['u8', 'a']
         * the first element is the type of data
         * the second is the name of data
         */
        matchs.map((_m, _i) => {
            let [_type, _name] = _m.split(' ');
            const matchs = _name.match(ELEMENT_PARTTEN)

            let _len = 0;

            if (matchs) {
                _len = matchs[2] | 0
                _name = matchs[1]
            }

            this.pairs[_i] = [_type, _name, _len]
        })
    }

    parse(buf) {
        this.data = [];
        let pos = 0;

        this.pairs.forEach(_p => {
            const [_t, _n, _len] = _p; // _t = 
            const [_C, _l] = C_TYPES[_t]
            const offset = _l + _len;
            const apart = buf.slice(pos, pos + offset)
            const tmp = new _C(apart)

            /**
             * if type is 'char' or 'uchar'
             * translate uint to string
             */
            const val = _t === 'char' || _t === 'uchar'
                ? this.#parseChar(tmp[0])
                : _len > 0
                    ? tmp
                    : tmp[0]


            this.data.push([_n, val])
            pos += offset
        });
    }

    #parseChar(charcode) {
        return String.fromCharCode(charcode)
    }

    /* ------------------------ */
    /*    Export Data Methods   */
    /* ------------------------ */

    /**
     * Export json type
     * @returns json type object
     */
    toJson() {
        console.log(this.data)
        return this.data.reduce((T, c) => (T = { ...T, [c[0]]: c[1] }), {});
    }
}

function cstruct(strings) {
    return new JSCStruct(strings[0]);
}

export default cstruct;