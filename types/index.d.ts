export declare class JSCStruct {
    private _rawString;
    private _fieldNames;
    private _decodeFieldDataset;
    private _structs;
    constructor(rawString: string);
    findStruct(name?: string): [string, import("./compile").FieldRecordArray] | undefined;
    decode(buffer: ArrayBuffer, structName?: string): this;
    toJson: () => {};
    toJSON: () => {};
}
export declare function qs(sds: TemplateStringsArray): JSCStruct;
