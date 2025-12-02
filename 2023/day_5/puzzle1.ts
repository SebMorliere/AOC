import { GenericSolver } from "../utils/generic-solver";

const DAY = 5;
const PART = 1;
const testFile = `./day_${DAY}/test${PART}.data`;
const inputFile = `./day_${DAY}/input${PART}.data`;

class Solver extends GenericSolver {
    readonly seeds: number[] = [];
    readonly seedToSoilMap: GardenMap[] = [];
    readonly soilToFertilizerMap: GardenMap[] = [];
    readonly fertilizerToWaterMap: GardenMap[] = [];
    readonly waterToLightMap: GardenMap[] = [];
    readonly lightToTemperatureMap: GardenMap[] = [];
    readonly temperatureToHumidityMap: GardenMap[] = [];
    readonly humidityToLocationMap: GardenMap[] = [];
    pointer: GardenMap[] = [];

    protected lineProcessor(line: string): void {
        if (line.startsWith("seeds: ")) {
            this.seeds.push(...line.replace("seeds: ", "").split(" ").map(s => +s));
        } else if (line.match("^[a-zA-Z]+")) {
            this.updatePointer(line);
        } else {
            const [destination, source, range] = line.split(" ").map(s => +s);
            this.pointer.push(new GardenMap(destination, source, range));
        }

    }

    protected resultProcessor(): void {
        this.res = this.seeds.map(seed => {
            return new SeedConversionBuilder(seed)
                .mapWith(this.seedToSoilMap)
                .mapWith(this.soilToFertilizerMap)
                .mapWith(this.fertilizerToWaterMap)
                .mapWith(this.waterToLightMap)
                .mapWith(this.lightToTemperatureMap)
                .mapWith(this.temperatureToHumidityMap)
                .mapWith(this.humidityToLocationMap)
                .build();
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

new Solver(DAY, PART, testFile).solve(); // expecting 35
new Solver(DAY, PART, inputFile).solve(); // accepted

class GardenMap {
    private readonly destination: number;
    private readonly source: number;
    private readonly range: number;

    constructor(destination: number, source: number, range: number) {
        this.destination = destination;
        this.source = source;
        this.range = range;
    }

    isMapped(input: number): boolean {
        return !(input < this.source || input > this.source + this.range - 1);
    }

    getDestination(input: number): number {
        if (this.isMapped(input)) {
            // in bounds, apply same translation to destination as from source
            const index: number = input - this.source;
            return  this.destination + index;
        } else {
            // out of bounds, destination = source
            return input;
        }
    }
}

class SeedConversionBuilder {
    private value: number;

    constructor(input: number) {
        this.value = input;
    }

    mapWith(gardenMaps: GardenMap[]): SeedConversionBuilder {
        const destinations = gardenMaps
            .map(gm => gm.getDestination(this.value))
            .filter(d => d !== this.value);
        if (destinations.length === 1) {
            this.value = destinations[0];
        }
        return this;
    }

    build() {
        return this.value;
    }
}