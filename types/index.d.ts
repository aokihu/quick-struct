export declare class JSCStruct {
    private _rawString;
    private _fieldNames;
    private _decodeFieldDataset;
    private _structs;
    private _littleEndian;
    constructor(rawString: string);
    findStruct(name?: string): [string, import("./compile").FieldRecordArray] | undefined;
    get isLittleEndian(): boolean;
    get isBigEndian(): boolean;
    get endianness(): string;
    decode(buffer: ArrayBuffer, structName?: string): this;
    toJson: () => {};
    toJSON: () => {};
}
export declare function qs(sds: TemplateStringsArray): JSCStruct;
