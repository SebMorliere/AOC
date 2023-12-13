import { GenericSolver } from "../shared/generic-solver";

const DAY = 5,
     PART = 2,
     DATA = 1;
const testFile = `./day_${DAY}/test${DATA}.data`,
     inputFile = `./day_${DAY}/input${DATA}.data`;

class Solver extends GenericSolver {
    readonly seedGenerators: SeedGenerator[] = [];
    readonly seedToSoilMap: LineMap[] = [];
    readonly soilToFertilizerMap: LineMap[] = [];
    readonly fertilizerToWaterMap: LineMap[] = [];
    readonly waterToLightMap: LineMap[] = [];
    readonly lightToTemperatureMap: LineMap[] = [];
    readonly temperatureToHumidityMap: LineMap[] = [];
    readonly humidityToLocationMap: LineMap[] = [];
    pointer: LineMap[] = [];

    protected lineProcessor(line: string): void {
        if (line.startsWith("seeds: ")) {
            const regExp = /\d+ \d+/g;
            const matchArray = line.replace("seeds: ", "").match(regExp) || [];
            const generators = matchArray.map((pair: string) => {
                const [source, range] = pair.split(" ");
                return new SeedGenerator(+source, +range);
            });
            this.seedGenerators.push(...generators);

        } else if (line.match("^[a-zA-Z]+")) {
            this.updatePointer(line);
        } else {
            const [destination, source, range] = line.split(" ").map(s => +s);
            this.pointer.push(new LineMap(destination, source, range));
        }
    }

    protected resultProcessor(): void {
        const seedMapper: SeedMapper = new SeedMapperBuilder()
            .set(new StageMap(this.seedToSoilMap))
            .set(new StageMap(this.soilToFertilizerMap))
            .set(new StageMap(this.fertilizerToWaterMap))
            .set(new StageMap(this.waterToLightMap))
            .set(new StageMap(this.lightToTemperatureMap))
            .set(new StageMap(this.temperatureToHumidityMap))
            .set(new StageMap(this.humidityToLocationMap))
            .build();

        this.res = this.seedGenerators.map(seedGenerator => {
            let lowestLocation = Infinity;
            while (seedGenerator.hasNext()) {
                const seed = seedGenerator.next();
                const location = seedMapper.map(seed);
                if (location < lowestLocation) {
                    lowestLocation = location;
                }
            }
            return lowestLocation;
        }).sort((a, b) => a - b)[0];
    }

    private updatePointer(line: string) {
        if (line.startsWith("seed-to-soil")) {
            this.pointer = this.seedToSoilMap;

        } else if (line.startsWith("soil-to-fertilizer")) {
            this.pointer = this.soilToFertilizerMap;

        } else if (line.startsWith("fertilizer-to-water")) {
            this.pointer = this.fertilizerToWaterMap;

        } else if (line.startsWith("water-to-light")) {
            this.pointer = this.waterToLightMap;

        } else if (line.startsWith("light-to-temperature")) {
            this.pointer = this.lightToTemperatureMap;

        } else if (line.startsWith("temperature-to-humidity")) {
            this.pointer = this.temperatureToHumidityMap;

        } else if (line.startsWith("humidity-to-location")) {
            this.pointer = this.humidityToLocationMap;

        } else {
            this.pointer = [];
        }
    }
}

new Solver(DAY, PART, testFile).solve(); // expecting 46
new Solver(DAY, PART, inputFile).solve(); // accepted 1493866
// 58880743 TOO HIGH
//      Execution time: 323.039s


// ****************************************************************************************************************

class SeedGenerator {
    private readonly endInclusive: number;
    private currentSeed: number;


    constructor(start: number, range: number) {
        this.endInclusive = start + range - 1;
        this.currentSeed = start;
    }

    next(): number {
        return this.currentSeed++;
    }

    hasNext(): boolean {
        return this.currentSeed !== this.endInclusive;
    }

}

class LineMap {
    private readonly lowLimit: number;
    private readonly highLimit: number;
    private readonly diff: number;

    constructor(destination: number, source: number, range: number) {
        this.lowLimit = source;
        this.highLimit = this.lowLimit + range - 1;
        this.diff = destination - source;
    }

    canMap(source: number): boolean {
        return this.lowLimit <= source && source < this.highLimit;
    }

    getDestination(source: number): number {
        return this.diff + source;
    }
}

class StageMap {
    private readonly maps: LineMap[] = [];

    constructor(lineMaps: LineMap[]) {
        this.maps.push(...lineMaps);
    }

    getLineMap(source: number): LineMap | undefined {
        return this.maps.find(lm => lm.canMap(source));
    }
}

class SeedMapperBuilder {
    private stageMaps: StageMap[] = [];

    set(stageMap: StageMap) {
        this.stageMaps.push(stageMap);
        return this;
    }

    build(): SeedMapper {
        return new SeedMapper(this.stageMaps);
    }
}

class SeedMapper {
    private stageMaps: StageMap[] = [];


    constructor(stageMaps: StageMap[]) {
        this.stageMaps = stageMaps;
    }

    map(source: number): number  {
        let destination = source;
        this.stageMaps.forEach(sm => {
            const lineMap = sm.getLineMap(destination);
            destination = lineMap ? lineMap.getDestination(destination) : destination;
        });
        return destination;
    }
}
