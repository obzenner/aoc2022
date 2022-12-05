import loadFile from "../../utils/loadFile";
import { splitByEmptyLine } from "../../utils/splitByEmptyLine";

type Program = Record<'quantity' | 'origin' | 'destination', number>[];

const isEmpty = (crate: string) => crate === ' ';

const exe = (input: Map<number, string[]>, program: Program, reverse = true) => {
    const inputMap = new Map(input); // to avoid mutation

    for (let i = 0; i < program.length; i++) {
        const origin = program[i].origin;
        const destination = program[i].destination;
        const quantity = program[i].quantity;

        if (origin === 0) {
            console.log(program[i], i);
        }

        const originStack = inputMap.get(origin);
        const destinationStack = inputMap.get(destination);

        const toMoveSlice = originStack.slice(originStack.length - quantity);
        const final = reverse ? toMoveSlice.reverse() : toMoveSlice; // too lazy to make this performant

        const newDestination = [...destinationStack, ...final];
        const newOrigin = [...originStack.slice(0, originStack.length - quantity)];
        
        inputMap.set(origin, newOrigin);
        inputMap.set(destination, newDestination);
    }

    const res = [...inputMap.values()].reduce((acc, stack) =>
        acc + stack[stack.length - 1],
    '');

    return res;
}

const getMappedCrates = (crates: string[], crateCharIndexes: number[]) => {
    const mappedCrates = crates.reduce((acc, line, index) => {
        if (index === crates.length - 1) { // ignore row with numbers
            return acc;
        }

        for (let i = 0; i < crateCharIndexes.length; i++) {
            const crateIndex = crateCharIndexes[i];
            const stackIndex = i + 1;
            const currentCrates = acc.get(stackIndex);

            const crate = line[crateIndex];
            const c = isEmpty(crate) ? [] : [crate];
    
            if (!currentCrates) {
                acc.set(stackIndex, c);
            } else {
                acc.set(stackIndex, [...c, ...currentCrates]);
            }
    
        }
        return acc;
    }, new Map() as Map<number, string[]>);
    
    return mappedCrates;
}

export const day5 = async () => {
    const input = splitByEmptyLine(await loadFile('day5.txt'));
    const crates = input.slice(0, input.indexOf(''));
    const instructions = input.slice(input.indexOf('') + 1);

    const numbers = crates[crates.length - 1];
    const crateCharIndexes: number[] = [];

    for (let i = 0; i < numbers.length; i++) {
        const char = numbers[i];
        if (!isNaN(parseInt(char))) {
            crateCharIndexes.push(i);
        }
    }

    // prep program object
    const program: Program = instructions.reduce((acc, line) => {
        const [quantity, origin, destination] = line.split(' ')
            .filter(v => !isNaN(parseInt(v)))
            .map(c => parseInt(c));

        acc.push({ quantity, origin, destination })
        return acc;
    }, [] as Program)

    const mappedCrates = getMappedCrates(crates, crateCharIndexes);

    return {
        part1: exe(mappedCrates, program),
        part2: exe(mappedCrates, program, false)
    }
}