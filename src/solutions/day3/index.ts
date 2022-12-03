import { access } from "fs";
import loadFile from "../../utils/loadFile";
import { splitByEmptyLine } from "../../utils/splitByEmptyLine";

const az = [..."abcdefghijklmnopqrstuvwxyz"];
const AZ = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

const az_PRIO = az.reduce((acc, cur, i) => {
    acc.set(cur, i + 1);
    return acc;
}, new Map<string, number>());

const AZ_PRIO = AZ.reduce((acc, cur, i) => {
    acc.set(cur, i + 27);
    return acc;
}, new Map<string, number>());

const isUpperCase = (char: string) => { return AZ.includes(char); };

const checkRucksack = (items: string) => {
    const comp1 = items.substring(0, items.length/2);
    const comp2 = items.substring(items.length/2);

    const mutualItems = [...comp1].reduce((acc, cur) => {
        if (comp2.includes(cur)) {
            const prio = isUpperCase(cur) ? AZ_PRIO.get(cur) : az_PRIO.get(cur);
            acc.set(cur, prio);
        }
        return acc;
    }, new Map<string, number>());

   return [...mutualItems.values()].reduce((acc, curr) => acc + curr, 0);
}

const checkGroup = (group: string[]) => {
    const first = group[0];
    const rest = group.slice(1);

    const mutualItems = [...first].reduce((acc, cur) => {
        const counter = rest.reduce((acc, r) => {
            return r.includes(cur) ? acc + 1 : acc;
        }, 0);

        if (counter > 1) {
            const prio = isUpperCase(cur) ? AZ_PRIO.get(cur) : az_PRIO.get(cur);
            acc.set(cur, prio);
        }
        return acc;
    }, new Map<string, number>());

    return mutualItems;
}

export const day3 = async () => {
    const input = splitByEmptyLine(await loadFile('day3.txt'));
    const groupsOfThree = input.reduce((acc, curr) => {
        const { counter, tick } = acc;
        const exists = acc.groups.get(counter);

        if (tick < 3) {
            acc.groups.set(counter, exists ? [...exists, curr] : [curr]);
            acc.tick++;
        } else {
            acc.counter++;
            acc.tick = 1;
            acc.groups.set(acc.counter, [curr]);
        }

        return acc;
    }, { groups: new Map(), counter: 0, tick: 0 });

    const rucksacks = input.reduce((acc, cur) => {
        const mutualItems = checkRucksack(cur);
        return acc + mutualItems;
    }, 0)
    
    const groupRucksacks = [...groupsOfThree.groups.values()].reduce((acc, cur) => {
        const mutualItems = checkGroup(cur);
        return acc + [...mutualItems.values()].reduce((acc, curr) => acc + curr, 0);
    }, 0);
    
    return {
        part1: rucksacks,
        part2: groupRucksacks,
    }
}