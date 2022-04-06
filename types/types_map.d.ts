export interface ITYPE_TO_CODE {
    [idx: string]: number;
}
export declare const TYPE_TO_CODE: ITYPE_TO_CODE;
export interface ICODE_TO_TYPE {
    [idx: number]: string;
}
export declare const CODE_TO_TYPE: ICODE_TO_TYPE;
export interface ICODE_TO_TYPEVIEW {
    [idx: number]: Uint8ArrayConstructor | Int8ArrayConstructor | Uint16ArrayConstructor | Int16ArrayConstructor | Uint32ArrayConstructor | Int32ArrayConstructor | BigUint64ArrayConstructor | BigInt64ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor;
}
export declare const CODE_TO_TYPEVIEW: ICODE_TO_TYPEVIEW;
export interface ICODE_TO_BYTE_SIZE {
    [idx: number]: number;
}
export declare const CODE_TO_BYTE_SIZE: ICODE_TO_BYTE_SIZE;
