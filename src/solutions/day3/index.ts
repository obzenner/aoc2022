import { access } from "fs";
import loadFile from "../../utils/loadFile";
import { splitByEmptyLine } from "../../utils/splitByEmptyLine";

const az = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"];

const az_PRIO = az.reduce((acc, cur, i) => {
    acc.set(cur, i + 1);
    return acc;
}, new Map<string, number>());

const checkRucksack = (items: string) => {
    const comp1 = items.substring(0, items.length/2);
    const comp2 = items.substring(items.length/2);

    const mutualItems = [...comp1].reduce((acc, cur) => {
        if (comp2.includes(cur)) {
            const prio = az_PRIO.get(cur);
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
            const prio = az_PRIO.get(cur);
            acc.set(cur, prio);
        }
        return acc;
    }, new Map<string, number>());

    return mutualItems;
}

const chunkArray = (arr: string[], size: number) => {
    const chunked_arr = [];
    for (let i = 0; i < arr.length; i += size) {
        chunked_arr.push(arr.slice(i, i + size));
    }
    return chunked_arr;
}

export const day3 = async () => {
    const input = splitByEmptyLine(await loadFile('day3.txt'));
    const groupsOfThree = chunkArray(input, 3);

    const rucksacks = input.reduce((acc, cur) => {
        const mutualItems = checkRucksack(cur);
        return acc + mutualItems;
    }, 0)
    
    const groupRucksacks = groupsOfThree.reduce((acc, cur) => {
        const mutualItems = checkGroup(cur);
        return acc + [...mutualItems.values()].reduce((acc, curr) => acc + curr, 0);
    }, 0);
    
    return {
        part1: rucksacks,
        part2: groupRucksacks,
    }
}