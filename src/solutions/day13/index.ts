import loadFile from "../../utils/loadFile";
import { splitByEmptyLine } from "../../utils/splitByEmptyLine";

const compareArrays = (left: number[] | number, right: number[] | number): boolean | undefined => {
	if (typeof left === 'number' && typeof right === 'number') {
		return left > right ? false : left < right ? true : undefined;
	} else if (Array.isArray(left) !== Array.isArray(right)) {
        const leftRecInput = Array.isArray(left) ? left : [left];
        const rightRecInput = Array.isArray(right) ? right : [right];
		return compareArrays(leftRecInput, rightRecInput);
	}

    if (Array.isArray(left) && Array.isArray(right)) {
        const maxSteps = Math.max(left.length, right.length);
    
        for (let i = 0; i < maxSteps; i++) {
            if (left[i] === undefined) return true;
            if (right[i] === undefined) return false;
    
            const result = compareArrays(left[i], right[i]);
            if (result !== undefined) return result;
        }
    }

	return undefined;
}


const part2 = (inputPackets: any[], dividerPackets = [[[2]], [[6]]]) => {
	const packets = [
		...dividerPackets,
		...inputPackets
	].sort((left, right) => {
		const result = compareArrays(left, right);
		return result === undefined ? 0 : result ? -1 : 1;
	});

	return dividerPackets
        .reduce((acc: number, curr) => acc * (packets.findIndex(p => JSON.stringify(p) === JSON.stringify(curr)) + 1), 1);
}



export const day13 = async () => {
    const input = splitByEmptyLine(await loadFile('day13.txt'))
        .reduce((acc, curr) => {
            if (curr === '') {
                acc.res.push(acc.placeHolder);
                acc.placeHolder = [];
                return acc;
            }
            acc.placeHolder.push(JSON.parse(`${curr}`));
            return acc;
        }, {
            res: [],
            placeHolder: [] as number[]
        });

    const part1 = input.res.reduce((acc, curr, index) => {
        const res = compareArrays(curr[0], curr[1]);
        if (res) {
            acc = acc + index + 1;
        }
        return acc;
    }, 0)

    const inputPart2 = await (await loadFile('day13.txt')).toString();
    const inputPackets = inputPart2
        .trim()
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
        .map(raw => JSON.parse(raw));

    return {
        part1,
        part2: part2(inputPackets)
    }
}