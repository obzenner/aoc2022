import loadFile from "../../utils/loadFile";

type Monkey = {
    items: number[],
    op: string[],
    numberOfItems: number,
    test: {
        divisible: number,
        true: number,
        false: number
    }
}


// taken from https://github.com/TenViki/advent-of-code/blob/main/2022/src/11/b.ts#L49
const superModulo = (monkeys: Monkey[]) => monkeys.reduce(
    (prev, monkey) => monkey.test.divisible * prev,
    1
);

const playRound = (monkeys: Monkey[], disableStressRelief = false): Monkey[] => {
    const monkeysClone: Monkey[] = JSON.parse(JSON.stringify(monkeys));

    for (let i = 0; i < monkeysClone.length; i++) {
        const { op, test } = monkeysClone[i];
        const [value1, operation, value2] = op;

        while (monkeysClone[i].items.length) {
            const item = monkeysClone[i].items.shift(); // may just as well use a for loop and set to [] when done

            let newValue = 0;
            const v1 = value1 === 'old' ? item : parseInt(value1);
            const v2 = value2 === 'old' ? item : parseInt(value2);

            switch (operation) {
                case '+':
                    newValue = v1 + v2;
                    break;
                case '-':
                    newValue = v1 - v2;
                    break;
                case '*':
                    newValue = v1 * v2;
                    break;
                case '/':
                    newValue = v1 / v2;
                    break;
            }

            newValue = newValue % superModulo(monkeysClone);

            const dividedByThree = disableStressRelief ? newValue : newValue / 3;
            const floored = Math.floor(dividedByThree)

            const divisibleByTest = floored % test.divisible === 0;

            if (divisibleByTest) {
                monkeysClone[test.true].items.push(floored);
            } else {
                monkeysClone[test.false].items.push(floored);
            }

            monkeysClone[i].numberOfItems++;
        }
    }

    return monkeysClone;
}

export const day11 = async () => {
    const input = (await loadFile('day11.txt'))
        .split('Monkey').filter(Boolean).map(m => {
            const monkey = m.split('\n').filter(Boolean).slice(1);
            const items = monkey[0].split('Starting items')[1].split(' ').slice(1);
            const op = monkey[1].split('Operation: new = ')[1].split(' ');
            const divisible = monkey[2].split('Test: divisible by ')[1];
            const testTrue = monkey[3].split('If true: throw to monkey ')[1];
            const testFalse = monkey[4].split('If false: throw to monkey ')[1];
            return {
                items: items.map(i => parseInt(i)),
                op,
                numberOfItems: 0,
                test: {
                    divisible: parseInt(divisible),
                    true: parseInt(testTrue),
                    false: parseInt(testFalse)
                }

            }
        });

    const getTwoMostActiveMonkeys = (monkeys: Monkey[]) => {
        return monkeys.map(m => m.numberOfItems)
            .sort((a, b) => a - b)
            .slice(monkeys.length - 2)
            .reduce((a, b) => a * b)
    }

    let part1 = playRound(input);
    for (let i = 0; i < 19; i++) {
        part1 = playRound(part1);
    }

    let part2 = playRound(input, true);
    for (let i = 0; i < 9999; i++) {
        part2 = playRound(part2, true);
    }

    return {
        part1: getTwoMostActiveMonkeys(part1),
        part2: getTwoMostActiveMonkeys(part2)
    }
}