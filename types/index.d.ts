export declare class JSCStruct {
    private _rawString;
    private _fieldNames;
    private _decodeFiledDataset;
    private _structs;
    constructor(rawString: string);
    findStruct(name?: string): [string, import("./compile").FieldRecordArray] | undefined;
    decode(buffer: ArrayBuffer, structName?: string): this;
    toJson: () => {};
    toJSON: () => {};
}
