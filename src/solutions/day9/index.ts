import loadFile from "../../utils/loadFile";
import { splitByEmptyLine } from "../../utils/splitByEmptyLine";

export const day9 = async () => {
    const input: { dir: string, dist: number }[]
        = splitByEmptyLine(await loadFile('day9.txt')).map(l => {
            const [dir, dist] = l.split(' ');
            return {
                dir,
                dist: parseInt(dist)
            }
        });

    const directions: Record<string, number[]> = {
        'R': [1, 0],
        'L': [-1, 0],
        'U': [0, 1],
        'D': [0, -1]
    }

    const calcTailPostion = ({ head, tail, dir, isHead = true }: {
        head: { x: number, y: number },
        tail?: { x: number, y: number },
        prevHead?: { x: number, y: number },
        dir?: string,
        isHead?: boolean
    }) => {
        const [dx, dy] = directions[dir];

        if (isHead) {
            head.x += dx;
            head.y += dy;

            return { ...head };
        }

        const diffX = Math.abs(head.x - tail.x);
        const diffY = Math.abs(head.y - tail.y);

        if (diffX < 2 && diffY < 2) {
            return tail;
        }

        if (diffX > 1 && !diffY) {
            tail.x += head.x - tail.x > 0 ? 1 : -1;
          } else if (diffY > 1 && !diffX) {
            tail.y += head.y - tail.y > 0 ? 1 : -1;
          } else {
            tail.x += head.x - tail.x > 0 ? 1 : -1;
            tail.y += head.y - tail.y > 0 ? 1 : -1;
          }

        return tail;
    }

    const runWithManyTails = (input: { dir: string, dist: number }[], numberOfTails = 2) => {
        const tails: {
            position: { x: number, y: number },
            memo: Set<string>
        }[] = [];

        for (let i = 0; i < numberOfTails; i++) {
            tails.push({
                position: { x: 0, y: 0 },
                memo: new Set(),
            })
        }

        tails.forEach(t => {
            t.memo.add('x:0;y:0');
        });

        for (let i = 0; i < input.length; i++) {
            const step = input[i];
            const { dir, dist } = step;

            let currentHead;
            for (let j = 0; j < dist; j++) {
                for (let k = 0; k < tails.length; k++) {
                    const tail = tails[k];
                    const isHead = k === 0;

                    if (isHead) {
                        tail.position = calcTailPostion({ head: tail.position, dir });
                    } else {
                        currentHead = tails[k - 1];
                        tail.position = calcTailPostion({
                            head: currentHead.position,
                            tail: tail.position,
                            dir,
                            isHead: false
                        });
                    }

                    const tailKey = `x:${tail.position.x};y:${tail.position.y}`;
                    tail.memo.add(tailKey);
                }
            }
        }

        return tails;
    }

    return {
        part1: runWithManyTails(input, 2)[1].memo.size,
        part2: runWithManyTails(input, 10)[9].memo.size
    }
}