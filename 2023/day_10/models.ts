export type TileType = "." // no pipe
                     | "|" // pipe North - South
                     | "-" // pipe West - East
                     | "L" // pipe North - East
                     | "J" // pipe North - West
                     | "F" // pipe South - East
                     | "7" // pipe South - West
                     | "S" // Starting point
                     ;

export class Tile {
    type: TileType;
    distance: number | null = null;

    constructor(type: string) {
        this.type = type as TileType;
    }

    pointToNorth(): boolean {
        return ["|", "L", "J", "S"].some(t => t === this.type);
    }

    pointToSouth(): boolean {
        return ["|", "F", "7", "S"].some(t => t === this.type);
    }

    pointToWest(): boolean {
        return ["-", "J", "7", "S"].some(t => t === this.type);
    }

    pointToEast(): boolean {
        return ["-", "L", "F", "S"].some(t => t === this.type);
    }

    isGround(): boolean {
        return this.type === ".";
    }

    isStartingPoint(): boolean {
        return this.type === "S";
    }

    acceptConnectionFrom(origin: Tile) {
        if (this.isGround() || origin.isGround()) {
            return false;
        } else {
            if(this.pointToSouth() && origin.pointToNorth()) {
                return true;
            } else if (this.pointToEast() && origin.pointToWest()) {
                return true;
            } else if (this.pointToNorth() && origin.pointToSouth()) {
                return true;
            } else if (this.pointToWest() && origin.pointToEast()) {
                return true;
            } else {
                return false;
            }

        }
    }
}