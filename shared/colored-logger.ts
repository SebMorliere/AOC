

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

export function tintFg(input: string | number, fgColor: FgColor): string {
    return tint(input, { fgColor });
}

export function tintBg(input: string | number, bgColor: BgColor): string {
    return tint(input, { bgColor });
}

export function tint(input: string | number, charColor: CharColor): string {
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
    MAGENTA = "35",
    CYAN = "36",
    WHITE = "37",

    GRAY = "90",
    BRIGHT_RED = "91",
    BRIGHT_GREEN = "92",
    BRIGHT_YELLOW = "93",
    BRIGHT_BLUE = "94",
    BRIGHT_MAGENTA = "95",
    BRIGHT_CYAN = "96",
    BRIGHT_WHITE = "97"
}

export enum BgColor {
    RESET = "49",
    BLACK = "40",
    RED = "41",
    GREEN = "42",
    YELLOW = "43",
    BLUE = "44",
    MAGENTA = "45",
    CYAN = "46",
    WHITE = "47",

    GRAY = "100",
    BRIGHT_RED = "101",
    BRIGHT_GREEN = "102",
    BRIGHT_YELLOW = "103",
    BRIGHT_BLUE = "104",
    BRIGHT_MAGENTA = "105",
    BRIGHT_CYAN = "106",
    BRIGHT_WHITE = "107",
}
