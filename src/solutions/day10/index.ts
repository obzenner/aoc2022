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

const draw = (input: Map<number, number>) => {
    let line = '';
    for (let i = 0; i <= input.size; i++) {
        const X: number = input.get(i + 1);
        const spritePosition = [X - 1, X, X + 1];
        const x = i % 40;
        
        if (x < 39) {
            if (spritePosition.includes(x)) {
                line += '#';
            } else {
                line += '.';
            }
        } else {
            console.log(line);
            line = '';
        }
    }
}

export const day10 = async () => {
    const input = splitByEmptyLine(await loadFile('day10.txt')).map(l => {
        const [command, value] = l.split(' ');
        return {
            command,
            value: value ? parseInt(value) : null
        }
    });

    const result = runProgram(input);

    draw(result.map);

    return {
        part1: getSignalStrength(result),
        part2: 2
    }
}