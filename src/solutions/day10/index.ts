import loadFile from "../../utils/loadFile";
import { splitByEmptyLine } from "../../utils/splitByEmptyLine";

const runProgram = (input: { command: string, value: number }[]) => {
    return input.reduce((acc, c) => {
        const { command, value } = c;

        switch (command) {
            case 'addx':
                for (let i = 0; i < 2; i++) {
                    acc.cycle++;
                    acc.map.set(acc.cycle, acc.x);
    
                    if (i === 1) {
                        acc.x += value;
                    }
                }
                break;
            case 'noop':
                acc.cycle++;
                acc.map.set(acc.cycle, acc.x);
                break;
        }

        return acc;
    }, {
        cycle: 0,
        x: 1,
        map: new Map(),
        strength: 0
    } as { cycle: number, x: number, map: Map<number, number> });
}

const getSignalStrength = (input: { cycle: number, x: number, map: Map<number, number> }) => {
    const { map } = input;
    let strength = 0;

    for (let i = 20; i <= 220; i += 40) {
        const val = map.get(i);
        if (val) {
            strength += i * map.get(i);
        }
    }

    return strength;
}


export const day10 = async () => {
    const input = splitByEmptyLine(await loadFile('day10.txt')).map(l => {
        const [command, value] = l.split(' ');
        return {
            command,
            value: value ? parseInt(value) : null
        }
    });

    const map = runProgram(input);
    return {
        part1: getSignalStrength(map),
        part2: 2
    }
}