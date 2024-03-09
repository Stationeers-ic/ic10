import { z } from "zod";
export declare const line: RegExp;
export declare const args: RegExp;
export declare const dynamicRegisterReg: RegExp;
export declare const dynamicRegisterGroups: z.ZodObject<{
    rr: z.ZodString;
    first: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rr: string;
    first: string;
}, {
    rr: string;
    first: string;
}>;
export declare const dynamicDevice: RegExp;
export declare const dynamicDeviceGroups: z.ZodObject<{
    rr: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rr: string;
}, {
    rr: string;
}>;
export declare const Position: z.ZodObject<{
    value: z.ZodString;
    start: z.ZodNumber;
    end: z.ZodNumber;
    length: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    length: number;
    value: string;
    start: number;
    end: number;
}, {
    length: number;
    value: string;
    start: number;
    end: number;
}>;
export declare const Positions: z.ZodObject<{
    fn: z.ZodObject<{
        value: z.ZodString;
        start: z.ZodNumber;
        end: z.ZodNumber;
        length: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        length: number;
        value: string;
        start: number;
        end: number;
    }, {
        length: number;
        value: string;
        start: number;
        end: number;
    }>;
    args: z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        start: z.ZodNumber;
        end: z.ZodNumber;
        length: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        length: number;
        value: string;
        start: number;
        end: number;
    }, {
        length: number;
        value: string;
        start: number;
        end: number;
    }>, "many">;
    comment: z.ZodObject<{
        value: z.ZodString;
        start: z.ZodNumber;
        end: z.ZodNumber;
        length: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        length: number;
        value: string;
        start: number;
        end: number;
    }, {
        length: number;
        value: string;
        start: number;
        end: number;
    }>;
}, "strip", z.ZodTypeAny, {
    fn: {
        length: number;
        value: string;
        start: number;
        end: number;
    };
    args: {
        length: number;
        value: string;
        start: number;
        end: number;
    }[];
    comment: {
        length: number;
        value: string;
        start: number;
        end: number;
    };
}, {
    fn: {
        length: number;
        value: string;
        start: number;
        end: number;
    };
    args: {
        length: number;
        value: string;
        start: number;
        end: number;
    }[];
    comment: {
        length: number;
        value: string;
        start: number;
        end: number;
    };
}>;
export type Positions = z.infer<typeof Positions>;
export type Position = z.infer<typeof Position>;
export declare const tokenize: (text: string) => {
    fn: {
        length: number;
        value: string;
        start: number;
        end: number;
    };
    args: {
        length: number;
        value: string;
        start: number;
        end: number;
    }[];
    comment: {
        length: number;
        value: string;
        start: number;
        end: number;
    };
} | null;
export declare const hash: RegExp;
export declare const reg: RegExp;
export declare const dev: RegExp;
export declare const strStart: RegExp;
export declare const strEnd: RegExp;
