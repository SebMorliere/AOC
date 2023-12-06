

export class ColoredLogger {
    private readonly customConsole: Console;

    constructor() {
        const { Console: customConsole } = console;
        this.customConsole = new customConsole({
            stdout: process.stdout,
            colorMode: false
        });
    }

    logTinted(...args: unknown[]) {
        this.customConsole.log(...args);
    }
}

export class Tinter {
    static tint(input: string | number, charColor: CharColor): string {
        const tints: string[] = [];
        const tintsReset: string[] = [];
        if (charColor.fgColor) {
            tints.push(charColor.fgColor);
            tintsReset.push(FgColor.RESET);
        }
        if (charColor.bgColor) {
            tints.push(charColor.bgColor);
            tintsReset.push(BgColor.RESET);
        }
        const tint: string = tints.length > 0 ? `\x1b[${tints.join(";")}m` : "";
        const unTint: string = tintsReset.length > 0 ? `\x1b[${tintsReset.join(";")}m` : "";

        return tint + input + unTint;
    }
}

export interface CharColor {
    fgColor?: FgColor;
    bgColor?: BgColor;
}

export enum FgColor {
    RESET = "0",
    BLACK = "30",
    RED = "31",
    GREEN = "32",
    YELLOW = "33",
    BLUE = "34",
    GRAY = "90",
    BRIGHT_YELLOW = "93"
}

export enum BgColor {
    RESET = "49",
    BLACK = "40",
    RED = "41",
    GREEN = "42",
    YELLOW = "43",
    BLUE = "44",
    GRAY = "100",
    BRIGHT_YELLOW = "103"
}
