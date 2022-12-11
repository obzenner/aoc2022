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

    const calcTailPostion = (head: { x: number, y: number },
        tail: { x: number, y: number },
        dir: string) => {
        const [dx, dy] = directions[dir];
        const prevHead = { ...head };

        head.x += dx;
        head.y += dy;

        // Manhattan distance
        const distance = Math.max(Math.abs(head.x - tail.x), Math.abs(head.y - tail.y));

        if (distance > 1) {
            tail = prevHead;
        }

        return tail;
    }

    const initPath = {
        head: { x: 0, y: 0 },
        tail: { x: 0, y: 0 },
        memo: new Map(),
        tailMemo: new Map(),
    }
    initPath.memo.set('x:0;y:0', 1);
    initPath.tailMemo.set('x:0;y:0', 1);

    const path = input.reduce((acc, step) => {
        const { dir, dist } = step;

        for (let i = 0; i < dist; i++) {
            acc.tail = calcTailPostion(acc.head, acc.tail, dir);
            const tailKey = `x:${acc.tail.x};y:${acc.tail.y}`;
            const tailExists = acc.tailMemo.get(tailKey);
            acc.tailMemo.set(tailKey, tailExists ? tailExists + 1 : 1);

            const key = `x:${acc.head.x};y:${acc.head.y}`;
            const exists = acc.memo.get(key);
            acc.memo.set(key, exists ? exists + 1 : 1);
        }

        return acc;
    }, initPath);

    return {
        part1: path.tailMemo.size,
        part2: 2
    }
}