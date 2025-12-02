import { SolverHandler } from '../utils/solverHandler';

const solverHandler = new SolverHandler(9, 2, 'input1.data', lineProcessor, solver);

interface SegmentInfo {
    index: number;
    length: number;
}
const NOT_FOUND_SEGMENT_INFO: SegmentInfo = { index: -1, length: -1 };

let segmentInfos: SegmentInfo[];

function lineProcessor(data: string): void {
    segmentInfos = buildDiskData(data);
}

function solver(): number {
    const fileIndexesToMove: number[] = segmentInfos
        .filter(segment => segment.index > -1)
        .map(segment => segment.index);

    while (fileIndexesToMove.length > 0) {
        let nextIndexToMove: number = fileIndexesToMove.pop() || 0;
        let fileToMove: SegmentInfo = segmentInfos
                .find(segment => segment.index === nextIndexToMove)
            || NOT_FOUND_SEGMENT_INFO;
        let indexLimit = segmentInfos.indexOf(fileToMove);
        let nextEmptySpaceBigEnough = segmentInfos
                .find((segment, index) => (index < indexLimit) && (segment.index < 0 && segment.length >= fileToMove.length))
            || NOT_FOUND_SEGMENT_INFO;

        if (nextEmptySpaceBigEnough.length > 0) {
            const poppedSegment = segmentInfos.splice(indexLimit, 1, { index: -1, length: fileToMove.length })[0];

            const emptySpaceIndex = segmentInfos.indexOf(nextEmptySpaceBigEnough);
            segmentInfos.splice(emptySpaceIndex, 1, poppedSegment);
            if (nextEmptySpaceBigEnough.length > poppedSegment.length) {
                segmentInfos.splice(emptySpaceIndex + 1, 0, { index: -1, length: nextEmptySpaceBigEnough.length - poppedSegment.length });
            }
        }
    }

    let diskImage: number[] = segmentInfos
        .flatMap(segment=> new Array(segment.length).fill(segment.index));
    return diskImage.map(v=> (v < 0 ? 0 : v)).reduce((previousValue, currentValue, currentIndex) => {
            return previousValue + (currentValue * currentIndex);
        }, 0);
}

function buildDiskData(diskMap: string): SegmentInfo[] {
    const diskMapArray: string[] = diskMap.split('');
    const segmentInfos: SegmentInfo[] = [];

    let isFile: boolean = true;
    let fileIndex: number = 0;
    while (diskMapArray.length > 0) {
        const nextIndex: number = isFile ? fileIndex++ : -1;
        const nextLength: number = +(diskMapArray.shift() || 0);
        segmentInfos.push({ index: nextIndex, length: nextLength });
        isFile = !isFile;
    }
    return segmentInfos;
}

solverHandler.solve();
