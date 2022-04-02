export declare class JSCStruct {
    private _rawString;
    private _keyNames;
    private _blocks;
    constructor(rawString: string);
    findStruckBlock(name?: string): [string, import("./compile").FieldRecordArray] | undefined;
    decode(buffer: ArrayBuffer, structName?: string): void;
}
