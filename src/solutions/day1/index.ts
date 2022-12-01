import loadFile from "../../utils/loadFile"
import { quickSort } from "../../utils/quickSort";
import { splitByEmptyLine } from "../../utils/splitByEmptyLine";

const mapElvesByCalories = (input: string): Map<number, number>  => {
    const lines = splitByEmptyLine(input);

    const mappedElvesToCals: { res: Map<number, number>, counter: number } = lines.reduce((acc, line) => {
      const cal = parseInt(line, 10);
      const exists = acc.res.get(acc.counter);
      
      if (isNaN(cal) && exists !== null) { // takes care of multiple empty lines
        acc.counter++;
        acc.res.set(acc.counter, null);
        return acc;
      } else {
        const newCal = exists ? exists + cal : cal

        acc.res.set(acc.counter, newCal);
        return acc;
      }
    }, { res: new Map(), counter: 0 });

    return mappedElvesToCals.res;
}

export const day1 = async () => {
  const input = await loadFile('day1.txt');
  const elvesByCalories = mapElvesByCalories(input);
  const res = quickSort(Array.from(elvesByCalories.values()));

  return {
    part1: res[res.length - 1],
    part2: res.slice(res.length - 3, res.length).reduce((acc, i) => acc + i, 0)
  }
}