import loadFile from "../../utils/loadFile";
import { splitByEmptyLine } from "../../utils/splitByEmptyLine";


const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1}, (_, i) => start + i);
}

const comparePairs = (pairs: string[][][]) => {
    const overlapping = pairs.reduce((acc, curr) => {
        const [p1, p2] = curr;

        const p1StartBoundary = parseInt(p1[0]);
        const p1EndBoundary = parseInt(p1[1]);
        const p2StartBoundary = parseInt(p2[0]);
        const p2EndBoundary = parseInt(p2[1]);

        if (p1StartBoundary <= p2StartBoundary && p1EndBoundary >= p2EndBoundary) {
            acc++;
        } else if (p2StartBoundary <= p1StartBoundary && p2EndBoundary >= p1EndBoundary) {
            acc++;
        }

        return acc;
    }, 0);

    return overlapping;
}


const partialMatch = (pairs: string[][][]) => {
    const overlapping = pairs.reduce((acc, curr) => {
        const [p1, p2] = curr;
    
        const p1Range = range(parseInt(p1[0]), parseInt(p1[1]));
        const p2Range = range(parseInt(p2[0]), parseInt(p2[1]));

        const p1RangeSet = new Set(p1Range);
    
        for (let i  = 0; i < p2Range.length; i++) {
            if (p1RangeSet.has(p2Range[i])) {
                acc++;
                return acc;
            }
        }

        return acc;
    }, 0);

    return overlapping;
}

export const day4 = async () => {
    const input =splitByEmptyLine(await loadFile('day4.txt')).map((line) => {
        return line.split(',').map(l => l.split("-"));
    });

    const day1P1 = comparePairs(input);

    const day1P2 = partialMatch(input);

    return  {
        part1: day1P1,
        part2: day1P2
    }
}