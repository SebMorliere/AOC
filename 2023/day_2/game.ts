export class Game {
    limits: GameResult;
    gameSet: GameSet[];

    constructor(redLimit: number, greenLimit: number, blueLimit: number) {
        this.limits = { red: redLimit, green: greenLimit, blue: blueLimit };
        this.gameSet = [];
    }

    pushFromInput(input: string) {
        const gameData = input.split(":");
        const id = +gameData[0].replace("Game ", "");
        const plays: GameResult[] = gameData[1].split(";")
            .map(grStr => {
                const gr: GameResult = { red: 0, green: 0, blue: 0 };
                grStr.split(",")
                    .map(c => c.trim())
                    .forEach(colorStr => {
                        if (colorStr.endsWith("red")) {
                            gr.red = +colorStr.replace("red", "").trim();
                        } else if (colorStr.endsWith("green")) {
                            gr.green = +colorStr.replace("green", "").trim();
                        } else if (colorStr.endsWith("blue")) {
                            gr.blue = +colorStr.replace("blue", "").trim();
                        }
                    });
                return gr;
            });
        const isValid: boolean = plays.every((gr) => {
            const isRedValid = !!gr.red && gr.red <= this.limits.red;
            const isGreenValid = !!gr.green && gr.green <= this.limits.green;
            const isBlueValid = !!gr.blue && gr.blue <= this.limits.blue;
            return (isRedValid && isGreenValid && isBlueValid);
        });
        const minViable: GameResult = {
            red: plays.map(play => play.red).sort((a: number, b: number) => b - a)[0],
            green: plays.map(play => play.green).sort((a: number, b: number) => b - a)[0],
            blue: plays.map(play => play.blue).sort((a: number, b: number) => b - a)[0]
        };
        const power: number = minViable.red * minViable.green * minViable.blue;
        this.gameSet.push({
            id: id,
            results: plays,
            isValid: isValid,
            minimumViable: minViable,
            power: power
        });
    }
}
export interface GameResult {
    red: number;
    green: number;
    blue: number;
}

export interface GameSet {
    id: number;
    results: GameResult[];
    isValid: boolean;
    minimumViable: GameResult;
    power: number;
}
