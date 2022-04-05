export declare class JSCStruct {
    private _rawString;
    private _fieldNames;
    private _decodeFiledDataset;
    private _structs;
    constructor(rawString: string);
    findStruct(name?: string): [string, import("./compile").FieldRecordArray] | undefined;
    sliceBuffer(buf: ArrayBuffer, typeCode: number, startIdx: number, length: number, isArray: boolean): (number | ArrayBuffer)[];
    decode(buffer: ArrayBuffer, structName?: string): this;
    toJson: () => {};
    toJSON: () => {};
}
export declare function qs(sds: TemplateStringsArray): JSCStruct;
