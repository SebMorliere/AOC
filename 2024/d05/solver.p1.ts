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
        if (isValid(pagesRule, data)) {
            res += extractMiddlePage(data);
        }
    }
}

function solver() {
    return res;
}

function isValid(rules: string[][], rawPageList: string): boolean {
    return rules.every((rule) => buildRegex(rule).exec(rawPageList) === null)
}

function extractMiddlePage(rawPageList: string): number {
    const pageList = rawPageList.split(',');
    return +pageList[Math.floor(pageList.length / 2)];
}

function buildRegex(rule: string[]): RegExp {
    return new RegExp(`(${rule[1]}),.*(${rule[0]})`, 'g');
}

solverHandler.solve();
