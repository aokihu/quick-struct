export declare type StructBlocks = Array<[string, FieldRecordArray]>;
export interface StructBlockRecord {
    [0]: string;
    [1]: string;
}
export declare type StructBlockRecordArray = Array<StructBlockRecord>;
export interface FieldRecord {
    [0]: string;
    [1]: number;
    [2]: number;
    [3]: number;
}
export declare type FieldRecordArray = Array<FieldRecord>;
export declare const findStructBlocks: (descriptor: string, fromIndex?: number) => StructBlockRecordArray;
export declare const parseAttribute: (typeCode: number, length: undefined | string, expand?: string | undefined) => 0 | 2 | 6 | 3 | 7;
export declare const parseBody: (body: string) => FieldRecordArray;
export declare const compile: (descriptor: string) => StructBlocks;
