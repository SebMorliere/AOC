import { SolverHandler } from '../utils/solverHandler';

const solverHandler = new SolverHandler(5, 1, './d05/input1.data', lineProcessor, solver);

const pagesRule: string[][] = [];
let isRule = true;
let res = 0;

function lineProcessor(data: string) {

    if (data.length === 0) {
        isRule = false;
        return;
    }
    if (isRule) {
        pagesRule.push(data.split('|'));
    } else {
        if (!isValidAllRules(data)) {
            let reorderedPageList = reorderPages(data);
            let midPage = extractMiddlePage(reorderedPageList);
            res += midPage;
        }
    }
}

function solver() {
    return res;
}

function reorderPages(pageListStr: string): string {
    let newPageList = pageListStr.slice().split(',').map(v => +v);

    let orderIsInvalid = !isValidAllRules(newPageList.join(','));
    while (orderIsInvalid) {
        const [indexLeft, indexRight] = findFirstInvalid(newPageList.join(','));
        const removed = newPageList.splice(indexRight, 1)[0];
        newPageList = [
            ...newPageList.slice(0, indexLeft),
            removed,
            ...newPageList.slice(indexLeft)
        ];
        orderIsInvalid = !isValidAllRules(newPageList.join(','));
    }
    return newPageList.join(',');
}

function isValidAllRules(pageListStr: string): boolean {
    return pagesRule.every(rule => isValidRule(pageListStr, rule));
}

function isValidRule(pageListStr: string, rule: string[]): boolean {
    return new RegExp(`(${rule[1]}),.*(${rule[0]})`, 'g').exec(pageListStr) === null;
}

function findFirstInvalid(pageListStr: string): number[] {
    const pageList: string[] = pageListStr.split(',');
    const invalidRule: string[] = pagesRule.find(rule => !isValidRule(pageListStr, rule)) || [];
    const index1 = pageList.findIndex(v => v === invalidRule[0]);
    const index2 = pageList.findIndex(v => v === invalidRule[1]);
    return [index1, index2];
}

function extractMiddlePage(rawPageList: string): number {
    const pageList = rawPageList.split(',');
    return +pageList[Math.floor(pageList.length / 2)];
}

solverHandler.solve();
