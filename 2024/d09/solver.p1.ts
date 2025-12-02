import { SolverHandler } from '../utils/solverHandler';

const solverHandler = new SolverHandler(9, 1, 'input1.data', lineProcessor, solver);

let diskMap: string = "";

function lineProcessor(data: string): void {
    diskMap += data;
}

function solver(): number {
    let diskImage = buildDiskImageFromMap(diskMap);

    let firstEmptySpaceIndex = diskImage.findIndex(id => id < 0);
    let lastFileIndex = diskImage.findLastIndex(id => id > -1)

    while (firstEmptySpaceIndex > -1 && firstEmptySpaceIndex < lastFileIndex) {
        diskImage[firstEmptySpaceIndex] = diskImage[lastFileIndex];
        diskImage.splice(lastFileIndex);
        firstEmptySpaceIndex = diskImage.findIndex(id => id < 0);
        lastFileIndex = diskImage.findLastIndex(id => id > -1);
    }

    return diskImage.map(v=> (v < 0 ? 0 : v)).reduce((previousValue, currentValue, currentIndex) => {
        return previousValue + (currentValue * currentIndex);
    }, 0);
}

function buildDiskImageFromMap(diskMap: string): number[] {
    let diskFileIndexes: number[] = [];
    let isFile = true;
    let fileIndex = 0;
    const diskMapArray = diskMap.split('');
    while (diskMapArray.length > 0) {
        const nextMapEntry = diskMapArray.shift() || '';
        const indexToAdd: number = isFile ? fileIndex++ : -1;
        const listOfIndexesToAdd: number[] = new Array(+nextMapEntry).fill(indexToAdd);
        diskFileIndexes.push(...listOfIndexesToAdd);
        isFile = !isFile;
    }
    return diskFileIndexes;
}

solverHandler.solve();
