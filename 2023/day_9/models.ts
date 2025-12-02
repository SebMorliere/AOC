export function extrapolateLast(values: number[]): number {
    const length = values.length;

    if (length < 2) {
        throw new Error("invalid length of value array");
    } else {
        const derivative: number[] = getDerivative(values);
        if (derivative.every(v => v === 0)) {
            const diff: number = values[length - 1] - values[length - 2];
            return values[length - 1] + diff;
        } else {
            const extrapole: number = extrapolateLast(derivative);
            return values[length - 1] + extrapole;
        }
    }
}

export function getDerivative(values: number[]): number[] {
    if (values.length < 2) {
        throw new Error("invalid length of value array");
    } else {
        const res: number[] = [];
        for (let i = 1; i < values.length; i++) {
            res.push(values[i] - values[i - 1]);
        }
        return res;
    }
}