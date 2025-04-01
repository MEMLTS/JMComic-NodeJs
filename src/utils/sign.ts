import { createHash } from 'node:crypto';

export function getNum(e: number, t: number | string): number {
    const decoded = {
        e,
        t,
        a: 268850,
        b: 421925,
        c: 421926
    };

    const hash = createHash('md5')
        .update(`${decoded.e}${decoded.t}`)
        .digest('hex');
    const hashChar = hash.slice(-1);
    let codeValue = hashChar.charCodeAt(0);

    if (decoded.e >= decoded.a && decoded.e <= decoded.b) {
        codeValue %= 10;
    } else if (decoded.e >= decoded.c) {
        codeValue %= 8;
    }

    const resultMap = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    return resultMap[codeValue] ?? 2;
}